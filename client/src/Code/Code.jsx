import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { BsPlayCircle } from 'react-icons/bs';
import { BiSolidDownload, BiCopy } from 'react-icons/bi';
import { BsLightningChargeFill, BsLightningCharge } from 'react-icons/bs';
import { PiFolderOpenBold } from 'react-icons/pi';
import { IoSaveSharp } from 'react-icons/io5';
import { MdLogout, MdOutlineCodeOff } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { authActions } from '../redux/store';
import './code.css';
import SaveCodeFile from '../pages/savecode';
import toast from "react-hot-toast";


const Code = () => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('cpp');
    const [output, setOutput] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const isLogin = useSelector((state) => state.isLogin);
    const dispatch = useDispatch();

    // AUTO SUGGESTIONS
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [activeSuggestion, setActiveSuggestion] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const textareaRef = useRef(null);

    // SAVE CODE
    const [openModal, setOpenModal] = useState(false);

    const [suggestions, setSuggestions] = useState([
        'function', 'if', 'for', 'while', 'console.log', 'return', 'int', 'string', 'array', 'map', 'class', 'bool', 'void', // Your suggestions here
    ]);

    useEffect(() => {
        const savedCode = localStorage.getItem('savedCode');
        if (savedCode) {
            setCode(savedCode);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('savedCode', code);
    }, [code]);

    const handleSuggestionSelected = suggestion => {
        const currentCode = code;
        const words = currentCode.split(' ');
        const caretPosition = textareaRef.current.selectionStart;
        words[words.length - 1] = suggestion;
        setCode(words.join(' '));
        setShowSuggestions(false);
        setActiveSuggestion(0);
        const newCaretPosition = caretPosition - words[words.length - 1].length + suggestion.length;
        textareaRef.current.setSelectionRange(newCaretPosition, newCaretPosition);
    };

    const handleTextareaKeyDown = e => {
        if (e.key === 'Enter') {
            if (showSuggestions && filteredSuggestions.length > 0) {
                e.preventDefault();
                handleSuggestionSelected(filteredSuggestions[activeSuggestion]);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestion(prevActive => (prevActive > 0 ? prevActive - 1 : prevActive));
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestion(prevActive =>
                prevActive < filteredSuggestions.length - 1 ? prevActive + 1 : prevActive
            );
        }
    };

    const handleTextareaChange = e => {
        const userInput = e.currentTarget.value;
        const caretPosition = e.currentTarget.selectionStart;
        const lastWordStart = userInput.substring(0, caretPosition).lastIndexOf(' ') + 1;
        const lastWord = userInput.substring(lastWordStart, caretPosition);

        const filtered = suggestions.filter(
            suggestion => suggestion.toLowerCase().indexOf(lastWord.toLowerCase()) === 0
        );

        setFilteredSuggestions(filtered);
        setShowSuggestions(filtered.length > 0 && lastWord.length > 0);
        setCode(userInput);
    };

    // HANDLE SUBMIT
    const handleSubmit = async () => {
        const payload = {
            language,
            code
        };

        try {
            const { data } = await axios.post("http://localhost:8080/run", payload);
            setOutput(data.output);
        } catch (error) {
            if (error.response) {
                const errMsg = error.response.data.err.stderr;
                setOutput(errMsg);
            } else {
                setOutput("Error in connecting to the server");
            }
        }
    };

    const handleDownload = () => {
        let fileExtension = '';
        let mimeType = '';

        if (language === 'cpp') {
            fileExtension = 'cpp';
            mimeType = 'text/x-c++src';
        } else if (language === 'py') {
            fileExtension = 'py';
            mimeType = 'text/x-python';
        }

        const blob = new Blob([code], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `your_code_file.${fileExtension}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleCopyToClipboard = () => {
        const codeTextArea = document.querySelector('.code');
        codeTextArea.select();
        document.execCommand('copy');
    };

    const handleDarkModeToggle = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleLogout = () => {
        dispatch(authActions.logout());
    };

    const handleRunCode = () => {
        if (!isLogin) {
            toast.error("You need to login to RUN the code.");
            return;
        } else {
            handleSubmit();
        }
    };

    return (
        <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
            <div className="header">
                <div className='heading'>
                    <h1>CPYLER</h1>
                    <span><MdOutlineCodeOff className='logo' /> </span>
                </div>

                <div className="buttons">
                    {!isLogin ? (
                        <>
                            <div className="icons">
                                <select
                                    className="select"
                                    value={language}
                                    onChange={(e) => {
                                        const shouldSwitch = window.confirm(
                                            "Are you sure you want to change language? WARNING: Your current code will be lost."
                                        );
                                        if (shouldSwitch) {
                                            setLanguage(e.target.value);
                                        }
                                    }}
                                >
                                    <option value="cpp">C++</option>
                                    <option value="py">Python</option>
                                    <option value="c">C</option>
                                </select>
                                <button className="run" onClick={handleRunCode} title="Run Code">
                                    <BsPlayCircle />
                                </button>
                                <button className="download" onClick={handleDownload} title="Download Code">
                                    <BiSolidDownload />
                                </button>
                                <button className="copy" onClick={handleCopyToClipboard} title="Copy Code">
                                    <BiCopy />
                                </button>
                                <button className="night-mode-btn" onClick={handleDarkModeToggle}>
                                    {isDarkMode ? <BsLightningCharge /> : <BsLightningChargeFill />}
                                </button>
                                <button
                                    type="submit"
                                    color="primary"
                                    variant="contained"
                                    onClick={() => {
                                        if (!isLogin) {
                                            toast.error("You need to login to save the code.");
                                        } else {
                                            setOpenModal(true);
                                        }
                                    }}
                                >
                                    <IoSaveSharp />
                                </button>
                            </div>
                            <Link to="/login">
                                <button className='login'>Login</button>
                            </Link>
                            <Link to="/register">
                                <button className='register'>Register</button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <SaveCodeFile initialCode={code} openModal={openModal} setOpenModal={setOpenModal} />
                            <div className="icons">
                                <select
                                    className="select"
                                    value={language}
                                    onChange={(e) => {
                                        const shouldSwitch = window.confirm(
                                            "Are you sure you want to change language? WARNING: Your current code will be lost."
                                        );
                                        if (shouldSwitch) {
                                            setLanguage(e.target.value);
                                        }
                                    }}
                                >
                                    <option value="cpp">C++</option>
                                    <option value="py">Python</option>
                                    <option value="c">C</option>
                                </select>
                                <button className="run" onClick={handleRunCode} title="Run Code">
                                    <BsPlayCircle />
                                </button>
                                <button className="download" onClick={handleDownload} title="Download Code">
                                    <BiSolidDownload />
                                </button>
                                <button className="copy" onClick={handleCopyToClipboard} title="Copy Code">
                                    <BiCopy />
                                </button>
                                <button className="night-mode-btn" onClick={handleDarkModeToggle}>
                                    {isDarkMode ? <BsLightningCharge /> : <BsLightningChargeFill />}
                                </button>
                                <button
                                    type="submit"
                                    color="primary"
                                    variant="contained"
                                    onClick={() => {
                                        if (!isLogin) {
                                            toast.error("You need to login to save the code.");
                                        } else {
                                            setOpenModal(true);
                                        }
                                    }}
                                >
                                    <IoSaveSharp />
                                </button>
                                <button>
                                    <Link to="/all-saved-codes" className="button-link"><PiFolderOpenBold /></Link>
                                </button>
                            </div>
                            <button onClick={handleLogout}> <MdLogout /></button>
                        </>
                    )}
                </div>
            </div>

            <div className="text">
                <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={handleTextareaChange}
                    onKeyDown={handleTextareaKeyDown}
                    className="code"
                ></textarea>
                {showSuggestions && (
                    <ul className="suggestions">
                        {filteredSuggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className={index === activeSuggestion ? 'active' : ''}
                                onClick={() => handleSuggestionSelected(suggestion)}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <h4 className="outputheading">OUTPUT</h4>
            <div className="output" style={{ whiteSpace: 'pre-wrap' }}>
                <div>{output}</div>
            </div>

            {openModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <SaveCodeFile initialCode={code} openModal={openModal} setOpenModal={setOpenModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Code;
