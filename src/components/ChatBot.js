import React, { useState } from "react";
import ChatBot from "react-simple-chatbot";
import { Segment } from "semantic-ui-react";
import styled from 'styled-components';

const ChatBotWrapper = styled.div`
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
`;

function App() {
    const [sourceLocation, setSourceLocation] = useState("");
    const [destinationLocation, setDestinationLocation] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [busType, setBusType] = useState("");
    const [seatNumber, setSeatNumber] = useState("");

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
            trigger: 'waiting1',
        },
        {
            id: "waiting1",
            user: true,
            trigger: 'Name',
        },
        {
            id: "Name",
            message: 'Please select your issue',
            trigger: 'issueOptions',
        },
        {
            id: "issueOptions",
            options: [
                { value: "Booking", label: "Booking", trigger: "Source" },
                { value: "Cancellation", label: "Cancellation", trigger: "Cancellation" },
            ],
        },
        {
            id: "Source",
            message: 'Please select your source',
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
                    return 'Please select a valid source';
                }
                setSourceLocation(value.trim());
                return true;
            }
        },
        {
            id: "Destination",
            message: 'Please select your destination',
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
                    return 'Please select a valid destination';
                }
                setDestinationLocation(value.trim());
                return true;
            }
        },
        {
            id: "Date",
            message: 'Please enter your travel date (dd/mm/yyyy)',
            trigger: 'DateInput',
        },
        {
            id: "DateInput",
            user: true,
            trigger: 'BusType',
            validator: (value) => {
                const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
                if (!datePattern.test(value.trim())) {
                    return 'Please enter a valid date in dd/mm/yyyy format';
                }
                setDateTime(value.trim());
                return true;
            }
        },
        {
            id: "BusType",
            message: 'Please select your bus type/class (e.g., AC, Non-AC, Sleeper, Seater)',
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
            message: 'Please enter your preferred seat number',
            trigger: 'SeatNumberInput',
        },
        {
            id: "SeatNumberInput",
            user: true,
            trigger: 'Booking',
            validator: (value) => {
                const seatNum = Number(value.trim());
                if (!Number.isInteger(seatNum) || seatNum <= 0) {
                    return 'Please enter a valid seat number';
                }
                setSeatNumber(seatNum);
                return true;
            }
        },
        {
            id: "Booking",
            message: 'Thanks for providing the details. Your booking has been confirmed.',
            end: true,
        },
        {
            id: "Cancellation",
            message: 'Your cancellation request has been processed.',
            end: true,
        }
    ];

    return (
        <ChatBotWrapper>
            <Segment floated="right">
                <ChatBot
                    steps={steps}
                    userDelay={500}
                    handleEnd={({ steps, values }) => {
                        console.log("Chat ended with the following steps and values:", steps, values);
                    }}
                />
            </Segment>
        </ChatBotWrapper>
    );
}

export default App;
