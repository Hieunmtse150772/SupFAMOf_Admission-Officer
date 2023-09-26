import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

type MyEditorProps = {
    value: string,
    onChange: (newValue: string) => void
}
const MyEditor: React.FC<MyEditorProps> = (value, onChange) => {
    const [text, setText] = useState<string>(''); // State to store the editor content

    // Quill configuration options
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
        ],
    };

    return (
        <ReactQuill
            value={text}
            onChange={(value) => setText(value)}
            modules={modules}
        />
    );
};

export default MyEditor;
