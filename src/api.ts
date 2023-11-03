import * as solid_web from 'solid-js/web'

export type Comment = {
    user: string
    time_ago: string
    content: string
    comments: Comment[]
}

export type Story = {
    id: string
    points: string
    url: string
    title: string
    domain: string
    type: string
    time_ago: string
    user: string
    comments_count: number
    comments: Comment[]
}

export type User = {
    error: string
    id: string
    created: string
    karma: number
    about: string
}

const storyURL = (path: string) => `https://node-hnapi.herokuapp.com/${path}`
const userURL = (path: string) => `https://hacker-news.firebaseio.com/v0/${path}.json`

export const unsafeFetchAPI = async (url: string): Promise<unknown> => {
    const response = await fetch(url, {
        headers: solid_web.isServer ? {'User-Agent': 'chrome'} : {},
    })
    const text = await response.text()
    if (text === null) throw new Error('Not found')
    return JSON.parse(text)
}

export const unsafeFetchStories = async (path: string): Promise<Story[]> => {
    const stories = await unsafeFetchAPI(storyURL(path))
    return stories as Story[]
}

export const unsafeFetchStory = async (path: string): Promise<Story> => {
    const story = await unsafeFetchAPI(storyURL(path))
    return story as Story
}

export const unsafeFetchUser = async (path: string): Promise<User> => {
    const user = await unsafeFetchAPI(userURL(path))
    return user as User
}
