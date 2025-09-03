"use client"

import React, { useState, useRef, useCallback } from 'react'
import { Upload, Camera, Check, RotateCcw, FileText } from 'lucide-react'
import { uploadFile } from '@/hooks/cloudinary'

// Toast notification utility
const toast = {
    success: (message: string) => alert(`✅ ${message}`),
    error: (message: string) => alert(`❌ ${message}`)
}

// Webcam component props interface
interface WebcamProps {
    audio?: boolean
    height?: number
    screenshotFormat?: string
    width?: number
    videoConstraints?: MediaTrackConstraints
    onUserMedia?: (stream: MediaStream) => void
    onUserMediaError?: (error: Error) => void
    className?: string
}

// Webcam ref interface
interface WebcamRef {
    getScreenshot: () => string | null
}

// Custom Webcam component
const Webcam = React.forwardRef<WebcamRef, WebcamProps>(({
    audio = false,
    height = 480,
    screenshotFormat = 'image/jpeg',
    width = 640,
    videoConstraints,
    onUserMedia,
    onUserMediaError,
    className
}, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const streamRef = useRef<MediaStream | null>(null)

    React.useImperativeHandle(ref, () => ({
        getScreenshot: (): string | null => {
            const video = videoRef.current
            if (!video || !video.videoWidth || !video.videoHeight) return null

            const canvas = document.createElement('canvas')
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight

            const ctx = canvas.getContext('2d')
            if (!ctx) return null

            ctx.drawImage(video, 0, 0)
            return canvas.toDataURL(screenshotFormat, 0.9)
        }
    }))

    React.useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: videoConstraints || { facingMode: 'user' },
                    audio
                })

                streamRef.current = stream

                if (videoRef.current) {
                    videoRef.current.srcObject = stream

                    // Handle play() promise to avoid AbortError
                    const playPromise = videoRef.current.play()
                    if (playPromise !== undefined) {
                        playPromise
                            .then(() => {
                                // Video started successfully
                            })
                            .catch((error: Error) => {
                                // Ignore harmless AbortError
                                if (error.name !== 'AbortError') {
                                    console.error('Video play error:', error)
                                }
                            })
                    }
                }

                onUserMedia?.(stream)
            } catch (error) {
                console.error('Camera error:', error)
                onUserMediaError?.(error as Error)
            }
        }

        startCamera()

        // Cleanup function
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop())
            }
        }
    }, [audio, videoConstraints, onUserMedia, onUserMediaError])

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            width={width}
            height={height}
            className={className}
        />
    )
})

Webcam.displayName = 'Webcam'


export default function UploadFileComponent() {

    const [adhaarFile, setAdhaarFile] = useState<File | null>(null)
    const [selfieCapture, setSelfieCapture] = useState<Blob | null>(null)
    const [showCamera, setShowCamera] = useState<boolean>(false)
    const [faceDetected, setFaceDetected] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [cameraError, setCameraError] = useState<string | null>(null)

    // Refs
    const webcamRef = useRef<WebcamRef>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Webcam configuration
    const videoConstraints: MediaTrackConstraints = {
        width: 640,
        height: 480,
        facingMode: "user"
    }

    // Camera event handlers
    const handleUserMedia = useCallback((stream: MediaStream): void => {
        console.log('Camera started successfully')
        setCameraError(null)

        // Simulate face detection after 3 seconds
        setTimeout(() => {
            setFaceDetected(true)
            console.log('Face detected!')
        }, 3000)
    }, [])

    const handleUserMediaError = useCallback((error: Error): void => {
        console.error('Camera error:', error)
        setCameraError('Failed to access camera. Please check permissions.')
        toast.error('Camera access denied. Please allow camera permissions.')
    }, [])

    // Camera controls
    const startCamera = useCallback((): void => {
        setShowCamera(true)
        setFaceDetected(false)
        setCameraError(null)
    }, [])

    const stopCamera = useCallback((): void => {
        setShowCamera(false)
        setFaceDetected(false)
        setCameraError(null)
    }, [])

    // Photo capture
    const capturePhoto = useCallback((): void => {
        if (!webcamRef.current) {
            toast.error('Camera not ready. Please try again.')
            return
        }

        try {
            const imageSrc = webcamRef.current.getScreenshot()

            if (!imageSrc) {
                toast.error('Failed to capture image. Please try again.')
                return
            }

            // Convert base64 to blob
            fetch(imageSrc)
                .then(res => res.blob())
                .then(blob => {
                    if (blob && blob.size > 1000) {
                        setSelfieCapture(blob)
                        stopCamera()
                        toast.success('Selfie captured successfully!')
                        console.log('Photo captured, blob size:', blob.size)
                    } else {
                        toast.error('Captured image is too small. Please try again.')
                    }
                })
                .catch(error => {
                    console.error('Error converting image:', error)
                    toast.error('Failed to process captured image.')
                })
        } catch (error) {
            console.error('Capture error:', error)
            toast.error('Failed to capture photo. Please try again.')
        }
    }, [stopCamera])

    // Retake selfie
    const retakeSelfie = useCallback((): void => {
        setSelfieCapture(null)
        startCamera()
    }, [startCamera])

    // File upload handler
    const handleAdhaarUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload a valid image file')
            return
        }

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size should be less than 10MB')
            return
        }

        setAdhaarFile(file)
        toast.success('Aadhaar uploaded successfully!')
    }, [])

    // Document submission
    const handleSubmitDocuments = useCallback(async (): Promise<void> => {
        if (!adhaarFile) {
            toast.error('Please upload your Aadhaar card first')
            return
        }
        if (!selfieCapture) {
            toast.error('Please take a selfie for verification first')
            return
        }

        setIsLoading(true)

        try {
            // Upload Aadhaar card first
            const aadhaarResponse = await uploadFile(adhaarFile, 'aadhaar')
            const photoResponse = await uploadFile(selfieCapture, 'photo')

            toast.success('Documents uploaded successfully!')

            // Check if both files are uploaded and redirect accordingly
            if (photoResponse.bothFilesUploaded) {
                window.location.href = `/${photoResponse.redirectUrl}`
            }

            console.log('Upload completed successfully')
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Failed to upload documents. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }, [adhaarFile, selfieCapture])


    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="text-center space-y-2 mb-6">
                <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Upload Documents</h2>
                <p className="text-gray-600">Please upload your Aadhaar and take a selfie</p>
            </div>

            <div className="space-y-6">
                {/* Aadhaar Upload Section */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Aadhaar Card</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                        {!adhaarFile ? (
                            <div
                                className="cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 mb-1">Click to upload Aadhaar</p>
                                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span className="text-sm text-gray-900">{adhaarFile.name}</span>
                                </div>
                                <button
                                    className="text-red-500 hover:text-red-700 text-sm"
                                    onClick={() => setAdhaarFile(null)}
                                    type="button"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAdhaarUpload}
                    />
                </div>

                {/* Separator */}
                <hr className="border-gray-200" />

                {/* Selfie Capture Section */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Live Photo (Selfie)</label>

                    {/* Camera Start Button */}
                    {!showCamera && !selfieCapture && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-3">Take a live selfie for verification</p>
                            <button
                                onClick={startCamera}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                                type="button"
                            >
                                <Camera className="w-4 h-4" />
                                Open Camera
                            </button>
                        </div>
                    )}

                    {/* Camera View */}
                    {showCamera && !cameraError && (
                        <div className="space-y-4">
                            <div className="relative rounded-lg overflow-hidden bg-black">
                                <Webcam
                                    ref={webcamRef}
                                    audio={false}
                                    height={320}
                                    screenshotFormat="image/jpeg"
                                    width={480}
                                    videoConstraints={videoConstraints}
                                    onUserMedia={handleUserMedia}
                                    onUserMediaError={handleUserMediaError}
                                    className="w-full h-64 object-cover"
                                />

                                {/* Face detection overlay */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div
                                        className={`w-48 h-48 border-2 rounded-full transition-colors duration-300 ${faceDetected ? 'border-green-500 shadow-green-500/50 shadow-lg' : 'border-blue-500'
                                            }`}
                                    >
                                        {faceDetected && (
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                                                <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                                                    Face Detected ✓
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Camera Controls */}
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={capturePhoto}
                                    className={`px-4 py-2 rounded-lg text-white flex items-center gap-2 transition-colors ${faceDetected
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                    type="button"
                                >
                                    <Camera className="w-4 h-4" />
                                    {faceDetected ? 'Capture Photo' : 'Capture'}
                                </button>
                                <button
                                    onClick={stopCamera}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                    type="button"
                                >
                                    Cancel
                                </button>
                            </div>
                            <p className="text-center text-xs text-gray-500">
                                {faceDetected ? 'Ready to capture!' : 'Position your face within the circle'}
                            </p>
                        </div>
                    )}

                    {/* Camera Error */}
                    {cameraError && (
                        <div className="border-2 border-red-300 rounded-lg p-6 text-center bg-red-50">
                            <p className="text-red-600 text-sm mb-3">{cameraError}</p>
                            <button
                                onClick={startCamera}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                type="button"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Selfie Preview */}
                    {selfieCapture && (
                        <div className="space-y-4">
                            <div className="relative rounded-lg overflow-hidden">
                                <img
                                    src={URL.createObjectURL(selfieCapture)}
                                    alt="Captured selfie"
                                    className="w-full h-64 object-cover"
                                />
                            </div>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={handleSubmitDocuments}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                    type="button"
                                    disabled={isLoading}
                                >
                                    <Check className="w-4 h-4" />
                                    Confirm Photo
                                </button>
                                <button
                                    onClick={retakeSelfie}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                    type="button"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Retake
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                {adhaarFile && selfieCapture && (
                    <button
                        onClick={handleSubmitDocuments}
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                        type="button"
                    >
                        {isLoading ? "Processing..." : "Submit Documents"}
                    </button>
                )}

                {/* Status Message */}
                {(!adhaarFile || !selfieCapture) && (
                    <div className="w-full p-3 bg-gray-50 rounded-lg text-center">
                        <p className="text-sm text-gray-600">
                            {!adhaarFile && !selfieCapture
                                ? 'Upload Aadhaar and take selfie to continue'
                                : !adhaarFile
                                    ? 'Upload Aadhaar to continue'
                                    : 'Take selfie to continue'
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}