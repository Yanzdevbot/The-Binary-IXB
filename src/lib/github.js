const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN
const REPO_OWNER = "raolbyte"
const REPO_NAME = "database"

const GITHUB_API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/`
const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/`

/**
 * Fetches the content of a file from GitHub.
 * @param {string} path - The path to the file in the repository (e.g., 'data/chats.json').
 * @returns {Promise<{content: string, sha: string|null}>} The file content and its SHA.
 */
async function getGitHubFile(path) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}${path}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json", // Request JSON response to get SHA and content
      },
    })

    if (response.status === 404) {
      console.warn(`File not found on GitHub: ${path}. Returning empty content.`)
      return { content: path.endsWith(".json") ? "[]" : "", sha: null }
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "No error message from API" })) // Try to parse, fallback if not JSON
      console.error(
        `GitHub API error fetching ${path}: Status ${response.status} - ${response.statusText}. Message: ${errorData.message}`,
      )
      throw new Error(`GitHub API error fetching ${path}: ${response.statusText} - ${errorData.message}`)
    }

    const fileInfo = await response.json()
    // GitHub returns content in base64 for JSON requests to /contents API
    const content = decodeURIComponent(escape(atob(fileInfo.content)))

    return { content, sha: fileInfo.sha }
  } catch (error) {
    console.error(`Caught error fetching file ${path} from GitHub:`, error) // Log the full error object
    if (path.endsWith(".json")) {
      return { content: "[]", sha: null }
    }
    throw error
  }
}

/**
 * Updates the content of a file on GitHub.
 * @param {string} path - The path to the file in the repository.
 * @param {string} content - The new content for the file.
 * @param {string|null} sha - The SHA of the file's current content. Required for updates.
 * @param {string} message - The commit message.
 * @returns {Promise<object>} The API response.
 */
async function updateGitHubFile(path, content, sha, message) {
  const encodedContent = btoa(unescape(encodeURIComponent(content)))
  const body = {
    message: message,
    content: encodedContent,
  }
  if (sha) {
    body.sha = sha
  }

  try {
    const response = await fetch(`${GITHUB_API_BASE}${path}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "No error message from API" }))
      console.error(
        `GitHub API error updating ${path}: Status ${response.status} - ${response.statusText}. Message: ${errorData.message}`,
      )
      throw new Error(`GitHub API error updating ${path}: ${response.statusText} - ${errorData.message}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Caught error updating file ${path} on GitHub:`, error)
    throw error
  }
}

/**
 * Uploads a base64 encoded image to GitHub.
 * @param {string} path - The path to the image file in the repository (e.g., 'cloud/my-image.png').
 * @param {string} base64Content - The Base64 encoded content of the image.
 * @param {string} message - The commit message.
 * @returns {Promise<object>} The API response.
 */
async function uploadGitHubImage(path, base64Content, message) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}${path}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        content: base64Content,
      }),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "No error message from API" }))
      console.error(
        `GitHub API error uploading image ${path}: Status ${response.status} - ${response.statusText}. Message: ${errorData.message}`,
      )
      throw new Error(`GitHub API error uploading image ${path}: ${response.statusText} - ${errorData.message}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Caught error uploading image ${path} to GitHub:`, error)
    throw error
  }
}

/**
 * Lists the contents of a directory on GitHub.
 * @param {string} path - The path to the directory in the repository.
 * @returns {Promise<Array<object>>} An array of file/directory objects.
 */
async function listGitHubDirectory(path) {
  try {
    const response = await fetch(`${GITHUB_API_BASE}${path}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "No error message from API" }))
      console.error(
        `GitHub API error listing directory ${path}: Status ${response.status} - ${response.statusText}. Message: ${errorData.message}`,
      )
      throw new Error(`GitHub API error listing directory ${path}: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Caught error listing directory ${path} from GitHub:`, error)
    return []
  }
}

export {
  getGitHubFile,
  updateGitHubFile,
  uploadGitHubImage,
  listGitHubDirectory,
  GITHUB_RAW_BASE,
  REPO_OWNER,
  REPO_NAME,
}
