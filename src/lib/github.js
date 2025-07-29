// src/lib/github.js
// WARNING: Hardcoding API key in client-side code is a security risk!
// For production, consider a server-side proxy or environment variables.
const GITHUB_TOKEN = "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"
const REPO_OWNER = "raolbyte" // IMPORTANT: Replace with your GitHub username
const REPO_NAME = "database" // IMPORTANT: Replace with your GitHub repository name

const GITHUB_API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/`
const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/` // Assuming 'main' branch

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
        Accept: "application/vnd.github.v3.raw", // To get raw content directly
      },
    })

    if (response.status === 404) {
      // File not found, return empty content and null SHA
      console.warn(`File not found on GitHub: ${path}. Returning empty content.`)
      return { content: path.endsWith(".json") ? "[]" : "", sha: null }
    }
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`GitHub API error fetching ${path}: ${response.statusText} - ${errorData.message}`)
    }

    const content = await response.text()

    // To get the SHA, we need to make another request without the raw accept header
    const fileInfoResponse = await fetch(`${GITHUB_API_BASE}${path}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    })
    if (!fileInfoResponse.ok) {
      const errorData = await fileInfoResponse.json()
      throw new Error(
        `GitHub API error fetching SHA for ${path}: ${fileInfoResponse.statusText} - ${errorData.message}`,
      )
    }
    const fileInfo = await fileInfoResponse.json()
    return { content, sha: fileInfo.sha }
  } catch (error) {
    console.error(`Error fetching file ${path} from GitHub:`, error)
    // Return default empty content for JSON files if they don't exist or error
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
  const encodedContent = btoa(unescape(encodeURIComponent(content))) // Base64 encode for GitHub API
  const body = {
    message: message,
    content: encodedContent,
  }
  if (sha) {
    body.sha = sha // Only include SHA if updating an existing file
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
      const errorData = await response.json()
      throw new Error(`GitHub API error updating ${path}: ${response.statusText} - ${errorData.message}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error updating file ${path} on GitHub:`, error)
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
        content: base64Content, // Already base64 encoded
      }),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`GitHub API error uploading image ${path}: ${response.statusText} - ${errorData.message}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error uploading image ${path} to GitHub:`, error)
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
      throw new Error(`GitHub API error listing directory ${path}: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error listing directory ${path} from GitHub:`, error)
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
