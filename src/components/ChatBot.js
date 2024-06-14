import React, { useState } from "react";
import ChatBot from "react-simple-chatbot";
import { Segment } from "semantic-ui-react";
import styled from 'styled-components';
import axios from 'axios';

const ChatBotWrapper = styled.div`
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
`;

function App() {
    const [name, setName] = useState("");
    const [sourceLocation, setSourceLocation] = useState("");
    const [destinationLocation, setDestinationLocation] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [busType, setBusType] = useState("");
    const [seatNumber, setSeatNumber] = useState("");
    const [issue, setIssue] = useState("");

    const locations = [
        'Mahatma Gandhi Bus Station (MGBS)', 'Jubilee Bus Station (JBS)', 'Koti Women\'s College Bus Stop', 'Dilsukhnagar Bus Stop',
        'Ameerpet Bus Stop', 'Mehdipatnam Bus Stop', 'Uppal Bus Stop', 'Kazipet Bus Stop', 'Hanamkonda Bus Stop',
        'Warangal Bus Stand', 'Nizamabad Bus Stand', 'Khammam Bus Stand', 'Karimnagar Bus Stand', 'Nalgonda Bus Stand',
        'Adilabad Bus Stand', 'Mahbubnagar Bus Stand', 'Siddipet Bus Stand', 'Bhongir Bus Stand', 'Mancherial Bus Stand',
        'Jagtial Bus Stand', 'Sircilla Bus Stand', 'Kothagudem Bus Stand', 'Kamareddy Bus Stand', 'Vemulawada Bus Stand',
        'Huzurabad Bus Stand', 'Banswada Bus Stand', 'Miryalaguda Bus Stand', 'Tandur Bus Stand', 'Nagarkurnool Bus Stand',
        'Wanaparthy Bus Stand', 'Gadwal Bus Stand', 'Sangareddy Bus Stand', 'Nirmal Bus Stand', 'Jangaon Bus Stand',
        'Zaheerabad Bus Stand', 'Bhadrachalam Bus Stand', 'Suryapet Bus Stand', 'Vikarabad Bus Stand', 'Medak Bus Stand',
        'Shamshabad', 'Patancheru', 'LB Nagar', 'Aloor', 'Choutuppal', 'Narsampet', 'Peddapalli', 'Armoor', 'Sathupalli',
        'Balkonda', 'Medchal', 'Chennur', 'Luxettipet'
    ];

    const sourceOptions = locations.map(location => ({ value: location, label: location, trigger: "SetSource" }));
    const destinationOptions = locations.filter(location => location !== sourceLocation).map(location => ({ value: location, label: location, trigger: "SetDestination" }));

    const steps = [
        {
            id: "Great",
            message: 'Hello, Welcome to our Website. Please enter your name.',
            trigger: 'NameInput',
        },
        {
            id: "NameInput",
            user: true,
            trigger: 'SetName',
        },
        {
            id: "SetName",
            message: 'Hi {previousValue}, please select your issue.',
            trigger: 'issueOptions',
            validator: (value) => {
                setName(value.trim());
                return true;
            }
        },
        {
            id: "issueOptions",
            options: [
                { value: "Booking", label: "Booking", trigger: "Source" },
                { value: "Cancellation", label: "Cancellation", trigger: "CancellationConfirmation" },
            ],
            validator: (value) => {
                setIssue(value);
                return true;
            }
        },
        {
            id: "Source",
            message: 'Please select your source location.',
            trigger: 'SourceOptions',
        },
        {
            id: "SourceOptions",
            options: sourceOptions,
        },
        {
            id: "SetSource",
            user: true,
            trigger: 'Destination',
            validator: (value) => {
                if (!locations.includes(value.trim())) {
                    return 'Please select a valid source location.';
                }
                setSourceLocation(value.trim());
                return true;
            }
        },
        {
            id: "Destination",
            message: 'Please select your destination location.',
            trigger: 'DestinationOptions',
        },
        {
            id: "DestinationOptions",
            options: destinationOptions,
        },
        {
            id: "SetDestination",
            user: true,
            trigger: 'Date',
            validator: (value) => {
                if (!locations.includes(value.trim())) {
                    return 'Please select a valid destination location.';
                }
                setDestinationLocation(value.trim());
                return true;
            }
        },
        {
            id: "Date",
            message: 'Please enter your travel date (dd/mm/yyyy).',
            trigger: 'DateInput',
        },
        {
            id: "DateInput",
            user: true,
            trigger: 'BusType',
            validator: (value) => {
                const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
                if (!datePattern.test(value.trim())) {
                    return 'Please enter a valid date in dd/mm/yyyy format.';
                }
                setDateTime(value.trim());
                return true;
            }
        },
        {
            id: "BusType",
            message: 'Please select your bus type/class (e.g., AC, Non-AC, Sleeper, Seater).',
            trigger: 'BusTypeInput',
        },
        {
            id: "BusTypeInput",
            user: true,
            trigger: 'SeatNumber',
            validator: (value) => {
                setBusType(value.trim());
                return true;
            }
        },
        {
            id: "SeatNumber",
            message: 'Please enter your preferred seat number.',
            trigger: 'SeatNumberInput',
        },
        {
            id: "SeatNumberInput",
            user: true,
            trigger: 'SubmitForm',
            validator: (value) => {
                const seatNum = Number(value.trim());
                if (!Number.isInteger(seatNum) || seatNum <= 0) {
                    return 'Please enter a valid seat number.';
                }
                setSeatNumber(seatNum);
                return true;
            }
        },
        {
            id: "SubmitForm",
            message: 'Thanks for providing the details. Your booking has been confirmed.',
            trigger: 'EndMessage',
            delay: 1000,
        },
        {
            id: "CancellationConfirmation",
            message: 'Are you sure you want to cancel the booking?',
            trigger: 'CancellationOptions',
        },
        {
            id: "CancellationOptions",
            options: [
                { value: "Yes", label: "Yes", trigger: "ProcessCancellation" },
                { value: "No", label: "No", trigger: "EndMessage" },
            ],
        },
        {
            id: "ProcessCancellation",
            message: 'Your cancellation request has been processed.',
            trigger: 'EndMessage',
        },
        {
            id: "EndMessage",
            message: 'We have received your request.',
            end: true,
            trigger: () => {
                handleSubmit(); // Call the function to submit data
                return 'end-message';
            }
        }
    ];

    const handleSubmit = async () => {
        try {
            if (issue === "Booking") {
                // Assuming your backend endpoint is http://localhost:8000/chatbot
                await axios.post("http://localhost:8000/chatbot", {
                    name,
                    sourceLocation,
                    destinationLocation,
                    dateTime,
                    busType,
                    seatNumber,
                    issue,
                });
            } else if (issue === "Cancellation") {
                await axios.post("http://localhost:8000/chatbot", {
                    name,
                    issue,
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <ChatBotWrapper>
            <Segment floated="right">
                <ChatBot
                    steps={steps}
                    userDelay={500}
                />
            </Segment>
        </ChatBotWrapper>
    );
}

export default App;