import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Params } from 'react-router-dom'
import { baseUrl } from '../../config/constants';

type Props = {}


type State = {
    isFound: boolean;
}

function RedirectPage({ }: Props) {

    const params = useParams();
    const shortUrl = params.shortId

    const [state, setState] = useState<State>({
        isFound: true
    })

    useEffect(() => {
        axios.get(`${baseUrl}/url/${shortUrl}/`).then((res) => {
            const { data, status } = res;
            if (status === 200) {
                if (data.code === 'FETCHED_OK') {
                    window.location.href = data.url;
                }

                if (data.code === 'NOT_FOUND') {
                    setState((prev) => ({ ...prev, isFound: false }))
                } 

            }
        }).catch(err => {
            console.log('err', err)
            // console.log('No', no.toString());
        })
    }, [])


    const { isFound } = state;

    return (
        <div className='container my-4'>
            {!isFound && (
                <div>
                    Link not found
                </div>
            )}
        </div>
    )
}

export default RedirectPage