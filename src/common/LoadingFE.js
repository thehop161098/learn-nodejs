import React, { Component } from 'react'
import ImgLoading from '../assets/images/loading.gif';

export default class LoadingFE extends Component {
    render() {
        return (
            <div id="loading">
                <img src={ImgLoading} alt="Loading..." />
            </div>
        )
    }
}
