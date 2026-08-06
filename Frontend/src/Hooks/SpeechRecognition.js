import {useState,useEffect,useRef} from "react";

const useSpeechRecognition=()=>{

    const [text,setText]=useState("");
    const [listening,setListening]=useState(false);
    const [completed,setCompleted]=useState(false);

    const recognitionRef=useRef(null);
    const silenceTimer=useRef(null);
    const textRef=useRef("");

    useEffect(()=>{

        const SpeechRecognition=
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if(!SpeechRecognition){
            console.error("Speech recognition not supported");
            return;
        }


        const recognition=new SpeechRecognition();

        recognition.continuous=true;
        recognition.interimResults=true;
        recognition.lang="en-US";


        recognition.onstart=()=>{

            console.log("🎤 Listening started");

            setListening(true);
            setCompleted(false);

        };


        recognition.onresult=(event)=>{

            let finalTranscript="";
            let interimTranscript="";


            for(
                let i=event.resultIndex;
                i<event.results.length;
                i++
            ){

                const transcript=
                    event.results[i][0].transcript;


                if(event.results[i].isFinal){

                    finalTranscript+=transcript;

                }else{

                    interimTranscript+=transcript;

                }

            }


            if(finalTranscript){

                textRef.current += finalTranscript;

                setText(textRef.current);


                console.log(
                    "Final:",
                    textRef.current
                );


                clearTimeout(
                    silenceTimer.current
                );


                silenceTimer.current=setTimeout(()=>{

                    console.log(
                        "User finished speaking"
                    );


                    recognition.stop();


                },3000);

            }

        };



        recognition.onend=()=>{

            console.log(
                "🎤 Listening ended"
            );


            setListening(false);


            if(textRef.current.trim()){

                setCompleted(true);

            }

        };



        recognition.onerror=(error)=>{

            console.log(
                "Speech error:",
                error.error
            );

            setListening(false);

        };


        recognitionRef.current=recognition;


        return()=>{

            recognition.stop();

            clearTimeout(
                silenceTimer.current
            );

        };


    },[]);



    const startListening=()=>{

        textRef.current="";
        setText("");
        setCompleted(false);


        if(recognitionRef.current){

            try{

                recognitionRef.current.start();

            }catch(error){

                console.log(error);

            }

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
        completed,
        startListening,
        stopListening
    };

};


export default useSpeechRecognition;