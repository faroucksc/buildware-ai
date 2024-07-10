"use server"

import { updateEmbeddedBranchById } from "@/db/queries/embedded-branch-queries"
import {
  createEmbeddedFiles,
  deleteAllEmbeddedFilesByEmbeddedBranchId
} from "@/db/queries/embedded-file-queries"
import { fetchFiles } from "@/lib/actions/github/fetch-files"
import { embedFiles } from "./embed-files"
import { fetchCodebaseForBranch } from "./fetch-codebase"
import { tokenizeFiles } from "./tokenize-files"

export async function embedBranch(data: {
  projectId: string
  githubRepoFullName: string
  branchName: string
  embeddedBranchId: string
  installationId: number
}) {
  const {
    projectId,
    githubRepoFullName,
    branchName,
    embeddedBranchId,
    installationId
  } = data

  try {
    // clear branch embeddings
    await deleteAllEmbeddedFilesByEmbeddedBranchId(embeddedBranchId)

    // fetch codebase for branch
    const codebase = await fetchCodebaseForBranch({
      githubRepoFullName,
      path: "",
      branch: branchName,
      installationId
    })

    // fetch file content
    const files = await fetchFiles(installationId, codebase)

    // tokenize files
    const tokenizedFiles = await tokenizeFiles(files)

    // embed files
    const embeddedFiles = await embedFiles(tokenizedFiles)

    // insert embedded files with data
    await createEmbeddedFiles(
      embeddedFiles.map(file => ({
        ...file,
        projectId,
        embeddedBranchId,
        githubRepoFullName
      }))
    )

    // update embedded branch with status
    await updateEmbeddedBranchById(embeddedBranchId, {
      isUpdated: true
    })
  } catch (error) {
    console.error("Error in embedBranch:", error)
    throw error
  }
}