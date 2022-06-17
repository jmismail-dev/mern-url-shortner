import React, { useState, useRef } from 'react';
import { Container, Row, Col, Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import axios, { AxiosRequestConfig } from 'axios';
import { ContentCopy, ContentCut, DoneAll } from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';

// Config
import { baseClientUrl, baseUrl } from '../../config/constants';

type Props = {}

type State = {
    text: string,
    isConverting: boolean,
    errors: Errors,
    isInitialChange: boolean,
    isCopied: boolean,
    resultURL: string
}

type Errors = {
    text?: string
}

function HomePage({ }: Props) {

    const [showTooltip, setShowTooltip] = useState(false);
    const target = useRef(null);

    const [state, setState] = useState<State>({
        text: '',
        isConverting: false,
        errors: {},
        isInitialChange: true,
        resultURL: '',
        isCopied: false
    })


    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {

        if (!state.isInitialChange) {
            handleValidate();
        }

        setState((prev) => ({ ...prev, [e.target.name]: e.target.value, isInitialChange: false }))
    }


    const handleSubmit = (): void => {
        const errors = handleValidate();
        if (Object.keys(errors).length === 0) {

            // Submit 
            const config: AxiosRequestConfig = {
                headers: {
                    "Context-Type": "application/json"
                }
            };

            axios.post(`${baseUrl}/url`, {
                url: state.text
            }, config).then(res => {
                if (res.status === 200) {
                    setState((prev) => ({ ...prev, errors: {}, text: '', isInitialChange: true, resultURL: `${baseClientUrl}/${res.data.nanoid}`, isCopied: false }))
                }
            })
        }
    }

    const handleValidate = (): Errors => {
        let errors: Errors = {};
        var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
        var regex = new RegExp(expression);

        if (state.text.trim() === '') {
            errors.text = "Required!"
        }
        else if (!state.text.match(regex)) {
            errors.text = "Invalid URL"
        }

        setState((prev) => ({ ...prev, errors }));
        return errors;
    }

    const onCopyContent = (resultURL: string): void => {
        setState((prev) => ({ ...prev, isCopied: true }));

        // Tooltip
        setShowTooltip(true)

        // Copy to Clipboard
        navigator.clipboard.writeText(resultURL)
    }


    const { text, errors, resultURL, isCopied } = state;

    const renderTooltip = (props: any) => (
        <Tooltip id="button-tooltip" {...props}>
            Copied to clipboard
        </Tooltip>
    );


    return (
        <>
            <div className="bg-dark text-light py-3">
                <Container className='my-4'>
                    Shortify
                </Container>
            </div>
            <div className="bg-light py-3">
                <Container className='my-4'>
                    <Row>
                        <Col md={10} sm={10} lg={10}>
                            <Form.Group>
                                <Form.Control type='text' name='text' value={text} onChange={(e) => handleChange(e)} />
                            </Form.Group>
                            {errors && errors['text']}
                        </Col>
                        <Col md={2} sm={2} lg={2}>
                            <Button onClick={() => handleSubmit()}> <ContentCut />Shortern </Button>
                        </Col>
                    </Row>

                    {
                        resultURL && (
                            <div className='d-flex justify-content-center align-items-center mt-4'>
                                <QRCodeSVG value={resultURL} />
                            </div>
                        )
                    }


                    <div className='d-flex justify-content-center align-items-center mt-4'>
                        <div>
                            {resultURL && (
                                <div className='d-flex flex-row justify-content-center align-items-center mt-4'>
                                    <a href={resultURL} target="_blank">{resultURL}</a>

                                    <OverlayTrigger
                                        placement="right"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltip}
                                    >
                                        <Button className='mx-4' onClick={() => onCopyContent(resultURL)}> {isCopied ? (<DoneAll />) : (<ContentCopy />)} </Button>

                                    </OverlayTrigger>

                                </div>
                            )}
                        </div>
                    </div>
                </Container>
            </div>
        </>
    )
}

export default HomePage