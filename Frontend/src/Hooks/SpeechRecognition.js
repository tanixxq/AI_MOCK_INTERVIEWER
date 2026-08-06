import {useState,useEffect,useRef} from "react";

const useSpeechRecognition=()=>{

    const [text,setText]=useState("");
    const [listening,setListening]=useState(false);

    const recognitionRef=useRef(null);


    useEffect(()=>{

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if(!SpeechRecognition){

            console.error(
                "Speech recognition is not supported in this browser"
            );

            return;

        }


        const recognition=new SpeechRecognition();


        recognition.continuous=true;

        recognition.interimResults=true;

        recognition.lang="en-US";


        recognition.onresult=(event)=>{

            let transcript="";


            for(
                let i=event.resultIndex;
                i<event.results.length;
                i++
            ){

                transcript +=
                event.results[i][0].transcript;

            }


            setText(transcript);

        };



        recognition.onstart=()=>{

            setListening(true);

        };



        recognition.onend=()=>{

            setListening(false);

        };



        recognition.onerror=(error)=>{

            console.log(
                "Speech error:",
                error
            );

            setListening(false);

        };


        recognitionRef.current=recognition;



    },[]);



    const startListening=()=>{

        if(
            recognitionRef.current &&
            !listening
        ){

            recognitionRef.current.start();

        }

    };



    const stopListening=()=>{

        if(recognitionRef.current){

            recognitionRef.current.stop();

        }

    };



    return{
        text,
        setText,
        listening,
        startListening,
        stopListening
    };

};


export default useSpeechRecognition;