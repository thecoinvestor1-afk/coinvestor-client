const uploadFile = async (file: File | Blob, fileType: 'identityProof' | 'photo', identityType?: 'aadhar' | 'pan') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileType', fileType)
    
    if (fileType === 'identityProof' && identityType) {
        formData.append('identityType', identityType)
    }

    const response = await fetch('http://localhost:8000/v1/profile/upload', {
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