import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { useEffect } from 'react';
import React, { useState } from 'react';
import Popover from 'react-popover';

function CodeBox(props) {
    useEffect(() => {
        hljs.highlightAll();
    }, []);

    return (
        <div className="code-box">
                <pre className="code hljs">
                    <code className={props.language}>{props.codeSnippet}</code>
                </pre>
        </div>
    );
}

function CodeBoxPopover(props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover
            isOpen={isOpen}
            body={<CodeBox codeSnippet={props.codeSnippet} setShowExample={setIsOpen} />}
            onOuterAction={() => setIsOpen(false)}
        >
            <button className='buttonexample' onClick={() => setIsOpen(true)}>{props.buttonTitle}</button>
        </Popover>
    );
}

export default CodeBoxPopover;
