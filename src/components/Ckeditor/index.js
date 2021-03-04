import React, { Component } from 'react'
import CKEditor from 'ckeditor4-react';

const CONFIG_CKEDITOR = {
    toolbar: [
        ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates'],
        ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'],
        ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt'],
        ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button',
            'ImageButton', 'HiddenField'
        ],
        ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-',
            'CopyFormatting', 'RemoveFormat'
        ],
        ['EasyImageUpload'],
        ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote',
            'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock',
            '-', 'BidiLtr', 'BidiRtl', 'Language'
        ],
        ['Link', 'Unlink', 'Anchor'],
        ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'],
        ['Styles', 'Format', 'Font', 'FontSize'],
        ['TextColor', 'BGColor'],
        ['Maximize', 'ShowBlocks'],
        // [ 'About' ],
    ],
    extraPlugins: 'easyimage',
    removePlugins: 'image',
    cloudServices_uploadUrl: 'https://33333.cke-cs.com/easyimage/upload/',
    cloudServices_tokenUrl: 'https://33333.cke-cs.com/token/dev/ijrDsqFix838Gh3wGO3F77FSW94BwcLXprJ4APSp3XQ26xsUHTi0jcb1hoBt'
};

export default class index extends Component {
    render() {
        return (
            <CKEditor
                data={this.props.data}
                onChange={this.props.onChange}
                config={CONFIG_CKEDITOR}
            />
        )
    }
}
