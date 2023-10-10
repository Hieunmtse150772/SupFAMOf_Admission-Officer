import styled from '@emotion/styled'
import RotateLeftOutlinedIcon from '@mui/icons-material/RotateLeftOutlined'
import RotateRightOutlinedIcon from '@mui/icons-material/RotateRightOutlined'
import { Box, Grid, Slider } from '@mui/material'
import React, { ChangeEvent, FC, useState } from 'react'
import AvatarEditor, { type Position } from 'react-avatar-editor'
import Dropzone from 'react-dropzone'
import Preview from './Preview'
import AvatarImagePath from './avatar.jpg'
import './styleAvatarEditorCustom.scss'

interface AvatarEditorCustomProps {
    avatar: string
}
const PrettoSlider = styled(Slider)({
    color: '#52af77',
    height: 8,
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
        '&:before': {
            display: 'none',
        },
    },
    '& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        fontSize: 12,
        background: 'unset',
        padding: 0,
        width: 32,
        height: 32,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: '#52af77',
        transformOrigin: 'bottom left',
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&:before': { display: 'none' },
        '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
            transform: 'rotate(45deg)',
        },
    },
});
const AvatarEditorCustom: FC<AvatarEditorCustomProps> = ({ avatar }) => {
    const editor = React.createRef<AvatarEditor>()
    const [image, setImage] = useState<string | File>(avatar);
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
    const [backgroundColor, setBackgroundColor] = useState<string | undefined>(undefined);

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

    const rotateLeft = () => {
        setRotate((rotate - 90) % 360)
    }

    const rotateRight = () => {
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

                    <Grid container {...getRootProps()} className="preview">
                        <Grid md={6}>
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
                        </Grid>
                        <Grid md={6}>
                            <h3>Props</h3>
                            Zoom:{' '}
                            <PrettoSlider
                                valueLabelDisplay="auto"
                                aria-label="pretto slider"
                                defaultValue={1}
                                min={allowZoomOut ? 0.1 : 1}
                                max={2}
                                step={0.001}
                                onChange={(e: any) => handleScale(e)}
                            />
                            <br />
                            Rotation:
                            <PrettoSlider
                                valueLabelDisplay="auto"
                                aria-label="pretto slider"
                                defaultValue={0}
                                min={0}
                                max={180}
                                step={1}
                                onChange={(e: any) => rotateScale(e)}
                            />
                            <br />
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>Rotate left</span>
                                <Box
                                    style={{ borderRadius: 50, backgroundColor: '#E5EAEA', width: 40, height: 40, display: 'flex' }}
                                    sx={{ "&:hover": { color: "#F09101" } }} onClick={rotateLeft} >
                                    <RotateLeftOutlinedIcon fontSize='medium' sx={{ margin: 'auto' }} />
                                </Box>
                                <span>Rotate right</span>

                                <Box
                                    style={{ borderRadius: 50, backgroundColor: '#E5EAEA', width: 40, height: 40, display: 'flex' }}
                                    sx={{ "&:hover": { color: "#F09101" } }} onClick={rotateRight} >
                                    <RotateRightOutlinedIcon fontSize='medium' sx={{ margin: 'auto' }} />
                                </Box>
                            </div>
                        </Grid>
                    </Grid>

                )}
            </Dropzone>

            <br />
            <input type="button" onClick={handleSave} value="Preview" />
            <br />
            {
                preview && (
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
                )
            }
        </div >
    )
}
export default AvatarEditorCustom;
