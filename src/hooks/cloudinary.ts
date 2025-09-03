const uploadFile = async (file: File | Blob, fileType: 'aadhaar' | 'photo') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileType', fileType)

    const response = await fetch('http://localhost:8000/v1/file/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error(`Failed to upload ${fileType}`)
    }

    return await response.json()
}

export { uploadFile }
