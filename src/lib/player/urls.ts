const DEFAULT_OPHIM_HOSTS = [
  "vip.opstream10.com",
  "vip.opstream90.com",
  "vip.opstream800.com",
] as const;

export interface PlayerHostAllowlists {
  video: ReadonlySet<string>;
  embed: ReadonlySet<string>;
}

function parseHostList(value: string | undefined): string[] {
  return (
    value
      ?.split(",")
      .map((host) => host.trim().toLowerCase())
      .filter(Boolean) ?? []
  );
}

function hostSet(extraHosts: string | undefined): ReadonlySet<string> {
  return new Set([...DEFAULT_OPHIM_HOSTS, ...parseHostList(extraHosts)]);
}

export function getPlayerHostAllowlists(): PlayerHostAllowlists {
  return {
    video: hostSet(process.env.PLAYER_VIDEO_HOSTS),
    embed: hostSet(process.env.PLAYER_EMBED_HOSTS),
  };
}

export function sanitizePlaybackUrl(
  value: string | undefined,
  allowedHosts: ReadonlySet<string>,
): string | undefined {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();

    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      (url.port && url.port !== "443") ||
      !allowedHosts.has(hostname)
    ) {
      return undefined;
    }

    return url.toString();
  } catch {
    return undefined;
  }
}
