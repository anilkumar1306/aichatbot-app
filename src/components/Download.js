import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const UserDetails = () => {
  const [name, setName] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/download?name=${name}`);

      if (response.status === 200) {
        const userData = response.data;
        setUserData(userData);
        setError('');
      } else {
        setError('User does not exist');
        setUserData(null);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('An error occurred while fetching user details');
      setUserData(null);
    }
  };

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchUserDetails();
  };

  const generatePDF = () => {
    if (!userData) return;
  
    const ticketContent = document.getElementById('ticket-content');
  
    html2canvas(ticketContent).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size
  
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
  
      // Calculate the aspect ratio of the captured canvas
      const ratio = canvas.width / canvas.height;
  
      // Determine dimensions based on aspect ratio and available space in PDF
      let imgWidth = width - 20;
      let imgHeight = imgWidth / ratio;
  
      // Check if the image height exceeds the height of the page
      if (imgHeight > height - 20) {
        imgHeight = height - 20;
        imgWidth = imgHeight * ratio;
      }
  
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
  
      // Add additional text "Happy Journey" and "TSRTC" at the end of the ticket
      pdf.setFontSize(14);
      pdf.setTextColor(44, 62, 80); // Dark blue-gray
      pdf.text('Happy Journey', width / 2, height - 30, 'center');
      pdf.setFontSize(12);
      pdf.setTextColor(192, 57, 43); // TSRTC red
      pdf.text('TSRTC', width / 2, height - 20, 'center');
  
      pdf.save(`${userData.name}_ticket.pdf`);
    });
  };

  return (
    <div style={{ textAlign: 'center', maxWidth: '600px', margin: 'auto' }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Enter Name:</label>
        <input type="text" value={name} onChange={handleChange} style={{ padding: '5px' }} />
        <button type="submit" style={{ padding: '5px 10px', marginLeft: '10px' }}>Fetch User Details</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {userData && (
        <div id="ticket-content" style={ticketStyle}>
          <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>Bus Ticket</h2>
          <hr style={{ border: 'none', borderBottom: '1px solid #ccc', marginBottom: '15px' }} />
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Source Location:</strong> {userData.sourceLocation}</p>
          <p><strong>Destination Location:</strong> {userData.destinationLocation}</p>
          <p><strong>Travel Date:</strong> {userData.travelDate}</p>
          <p><strong>Bus Type:</strong> {userData.busType}</p>
          <p><strong>Seats:</strong> {userData.seats}</p>
        </div>
      )}

      {userData && (
        <button onClick={generatePDF} style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}>Generate PDF Ticket</button>
      )}
    </div>
  );
};

export default UserDetails;

// Styles for ticket content
const ticketStyle = {
  backgroundColor: '#ecf0f1',
  padding: '20px',
  border: '1px solid #bdc3c7',
  borderRadius: '5px',
  marginBottom: '20px',
};
