import { expect, test } from "bun:test"
import { initialLocation } from "../src/location"

const location = { directory: "/actual" }

test("uses the location returned by file listing", async () => {
  const calls: string[] = []
  const client = {
    file: {
      list: async (input: { location: { directory: string } }) => {
        calls.push(`file:${input.location.directory}`)
        return { location }
      },
    },
    location: {
      get: async (input: { location: { directory: string } }) => {
        calls.push(`location:${input.location.directory}`)
        return location
      },
    },
  }

  expect(await initialLocation(client, "/actual")).toEqual(location)
  expect(calls).toEqual(["file:/actual"])
})

test("falls back to the client cwd when file listing fails", async () => {
  const calls: string[] = []
  const client = {
    file: {
      list: async (input: { location: { directory: string } }) => {
        calls.push(`file:${input.location.directory}`)
        throw new Error("file listing unavailable")
      },
    },
    location: {
      get: async (input: { location: { directory: string } }) => {
        calls.push(`location:${input.location.directory}`)
        return location
      },
    },
  }

  expect(await initialLocation(client, "/actual")).toEqual(location)
  expect(calls).toEqual(["file:/actual", "location:/actual"])
})
