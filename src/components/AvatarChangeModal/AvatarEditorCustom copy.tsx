import React, { ChangeEvent, MouseEventHandler, useState } from 'react'
import AvatarEditor, { type Position } from 'react-avatar-editor'
import Dropzone from 'react-dropzone'
import Preview from './Preview'

import AvatarImagePath from './avatar.jpg'

type State = {
    image: string | File
    allowZoomOut: boolean
    position: Position
    scale: number
    rotate: number
    borderRadius: number
    preview?: {
        img: string
        rect: {
            x: number
            y: number
            width: number
            height: number
        }
        scale: number
        width: number
        height: number
        borderRadius: number
    }
    width: number
    height: number
    disableCanvasRotation: boolean
    isTransparent: boolean
    backgroundColor?: string
    showGrid: boolean
}

const AvatarEditorCustom = () => {
    const editor = React.createRef<AvatarEditor>()
    const [image, setImage] = useState<string | File>(AvatarImagePath);
    const [allowZoomOut, setAllowZoomOut] = useState<boolean>(false);
    const [position, setPosition] = useState<Position>({ x: 0.5, y: 0.5 });
    const [scale, setScale] = useState<number>(1);
    const [rotate, setRotate] = useState<number>(0);
    const [borderRadius, setBorderRadius] = useState<number>(0);
    const [preview, setPreview] = useState<{
        img: string;
        rect: { x: number; y: number; width: number; height: number };
        scale: number;
        width: number;
        height: number;
        borderRadius: number;
    } | undefined>(undefined);
    const [width, setWidth] = useState<number>(300);
    const [height, setHeight] = useState<number>(300);
    const [disableCanvasRotation, setDisableCanvasRotation] = useState<boolean>(false);
    const [isTransparent, setIsTransparent] = useState<boolean>(false);
    const [backgroundColor, setBackgroundColor] = useState<string | undefined>(undefined);
    const [showGrid, setShowGrid] = useState<boolean>(false);
    const state: State = {
        image: AvatarImagePath,
        allowZoomOut: false,
        position: { x: 0.5, y: 0.5 },
        scale: 1,
        rotate: 0,
        borderRadius: 0,
        preview: undefined,
        width: 300,
        height: 300,
        disableCanvasRotation: false,
        isTransparent: false,
        backgroundColor: undefined,
        showGrid: false,
    }

    const handleNewImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleSave = () => {
        const img = editor.current?.getImageScaledToCanvas().toDataURL()
        const rect = editor.current?.getCroppingRect()

        if (!img || !rect) return

        setPreview({
            img,
            rect,
            scale: scale,
            width: width,
            height: height,
            borderRadius: borderRadius
        }
        )
    }

    const handleScale = (e: ChangeEvent<HTMLInputElement>) => {
        const scale = parseFloat(e.target.value)
        setScale(scale)
    }

    const rotateScale = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setRotate(parseFloat(e.target.value))
    }

    const rotateLeft: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        setRotate((rotate - 90) % 360)
    }

    const rotateRight: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        setRotate((rotate + 90) % 360)
    }

    const logCallback = (e: any) => {
        console.log('callback', e)
    }

    const handlePositionChange = (position: Position) => {
        setPosition(position)
    }

    return (
        <div>
            <Dropzone
                onDrop={([image]) => setImage(image)}
                noClick
                multiple={false}
            >
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} className="preview">
                        <input
                            name="newImage"
                            type="file"
                            onChange={handleNewImage}
                            {...getInputProps()}
                        />
                        <AvatarEditor
                            ref={editor}
                            scale={scale}
                            width={width}
                            height={height}
                            position={position}
                            onPositionChange={handlePositionChange}
                            rotate={rotate}
                            borderRadius={
                                width / (100 / borderRadius)
                            }
                            backgroundColor={backgroundColor}
                            onLoadFailure={logCallback.bind(this, 'onLoadFailed')}
                            onLoadSuccess={logCallback.bind(this, 'onLoadSuccess')}
                            onImageReady={logCallback.bind(this, 'onImageReady')}
                            image={image}
                            disableCanvasRotation={disableCanvasRotation}
                        />

                    </div>
                )}
            </Dropzone>
            <br />
            <h3>Props</h3>
            Zoom:{' '}
            <input
                name="scale"
                type="range"
                onChange={handleScale}
                min={allowZoomOut ? '0.1' : '1'}
                max="2"
                step="0.01"
                defaultValue="1"
            />
            <br />
            Rotate:
            <button onClick={rotateLeft}>Left</button>
            <button onClick={rotateRight}>Right</button>
            <br />
            Rotation:
            <input
                name="rotation"
                type="range"
                onChange={rotateScale}
                min="0"
                max="180"
                step="1"
                defaultValue="0"
            />
            <br />
            <br />
            <input type="button" onClick={handleSave} value="Preview" />
            <br />
            {preview && (
                <>
                    <img
                        alt=""
                        src={preview.img}
                        style={{
                            borderRadius: `${(Math.min(
                                preview.height,
                                preview.width,
                            ) +
                                10) *
                                (preview.borderRadius / 2 / 100)
                                }px`,
                        }}
                    />
                    <Preview
                        width={
                            preview.scale < 1
                                ? preview.width
                                : (preview.height * 478) / 270
                        }
                        height={preview.height}
                        image={AvatarImagePath}
                        rect={preview.rect}
                    />
                </>
            )}
        </div>
    )
}
export default AvatarEditorCustom;
