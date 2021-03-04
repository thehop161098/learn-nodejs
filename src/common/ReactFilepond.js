import React, { Component } from 'react'
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
// import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
registerPlugin(FilePondPluginImagePreview);

export default class ReactFilepond extends Component {
    render() {
        const { allowMultiple, maxFiles, onupdatefiles, files } = this.props;
        return (
            <FilePond
                files={files}
                allowMultiple={allowMultiple}
                maxFiles={maxFiles}
                onupdatefiles={(fileItems) => {
                    console.log('asdasc')
                    onupdatefiles(fileItems);
                }}
                onDrop={this.handleUploadImages}
            />
        )
    }
}
