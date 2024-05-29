import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Meta = (props) => {
    return (
        <HelmetProvider>
            <Helmet>
                <meta charset='utf-8' />
                     {/* SEO 태그 */}
                    <title>{props.title}</title>
                    <meta name='description' content={props.descriptopn} />
                    <meta name='keywords' content={props.keywords} />
                    <meta name='author' content={props.author} />
                    <meta name='og:type' content={'website'} />
                    <meta name='og:title' content={props.title} />
                    <meta name='og:description' content={props.descriptopn} />
                    <meta name='og:url' content={props.url} />
                    {/* <meta name='og:image' content={props.image} /> */}

                    {/* 웹폰트 적용 */
                    /* font-family: 'SUIT', sans-serif; */}
                    <link href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/static/woff2/SUIT.css" rel="stylesheet"></link>
                    {/* 웹폰트 적용 */
                    /* font-family: 'SUIT Variable', sans-serif; */}
                    <link href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/variable/woff2/SUIT-Variable.css" rel="stylesheet"></link>


                    
                    {/* Helmet 안에서 CSS 적용하기 */}
                    <style type="text/css">{`
                    * {
                        font-family: 'SUIT', sans-serif;
                        text-decoration: none;
                        color: black;
                        list-style: none;
                    }

                    h1 {
                        margin: 0;
                    }

                    body {
                        margin: 0;
                        padding: 0;
                    }

                    `}</style>
            </Helmet>
        </HelmetProvider>
    );
};

Meta.defaultProps = {
    title: 'UNICO Official Site',
    description : '2023 UNICO Official site',
    keywords: 'UNICO',
    author: 'Junbeom',
    // image: '기본이미지변수적용'
    url: window.location.href,
};

export default Meta;