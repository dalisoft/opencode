import type { LocationRef } from "@opencode/client/promise"

type Client = {
  file: {
    list(input: { location: { directory: string } }): Promise<{ location: LocationRef }>
  }
  location: {
    get(input: { location: { directory: string } }): Promise<LocationRef>
  }
}

/**
 * Resolve the location the TUI should open in.
 *
 * `file.list` initializes the location and returns its canonical project metadata. If that
 * request fails, resolve the client's actual cwd instead of falling back to the server's
 * active location, which may be an unrelated directory.
 */
export async function initialLocation(client: Client, directory = process.cwd()): Promise<LocationRef> {
  const location = { directory }
  try {
    return (await client.file.list({ location })).location
  } catch {
    return client.location.get({ location })
  }
}
