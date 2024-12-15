import { useEffect, useState } from "react";
import './style.css';  // Import the CSS file
import { VapiClient } from "@vapi-ai/server-sdk";

const App = () => {

  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const [calls, setCalls] = useState([]); // State to store API response


  useEffect(() => {
    const fetchCalls = async () => {
      try {


        // Create the VapiClient instance with the token
        const client = new VapiClient({ token: "0e69d7ab-b3bb-4dad-b5ed-f227c5a85b22" });

        // Fetch the list of calls
        const response = await client.calls.list();

        const extractedData = response.map(call => ({
          id: call.id,
          startedAt: call.startedAt,
          endedAt: call.endedAt,
          costBreakdown: call.costBreakdown,
          type: call.type,
          status: call.status,
          endedReason: call.endedReason,
          summary: call.analysis?.summary || "No summary available",
          structuredData: call.analysis?.structuredData || null
        }));

        // Update the state with the extracted data
        setCalls(extractedData);

      } catch (err) {
        console.error("Error fetching calls:", err);
        setError(err.message);
      } finally {
        setLoading(false); // Stop loading after API call
      }
    };

    fetchCalls();
  }, []); // Empty dependency array means this runs once when the component mounts


  return (
    <div>
      <h1 className="purple">Clara Desk</h1>
      <h2>Inbound calls</h2>
      {calls.length > 0 ? (
        <ul className="callList">
          {calls.map((call, index) => (
            <li key={index} className="callBox">
              
              <div className="flexBox">
                <span className="gray">{call.id}</span>
                <span className="callFeature">{call.status}</span>
                <span className="callFeature">{call.type}</span>
                <span className="callFeature">{call.endedReason}</span>
              </div>
              
              <div className="flexBox">
                <span>From: {call.startedAt} </span>
                <span>To: {call.endedAt} </span>
              </div>
      
            
              {call.structuredData != null && 
              <div className="boxInCall">
              <span color="graySecond">Client name: {call.structuredData.client_name} </span><br></br>
              <span>Accomodation requested: {call.structuredData.accomodation_requested} </span><br></br>
              <span>Appointment requested: {call.structuredData.appointment_date} at {call.structuredData.appointment_time} </span><br></br>
              <span>Call notes: {call.structuredData.notes } </span><br></br>
              </div>
              }
              
              <div className="boxInCall">
                <strong>Summary:</strong><br></br> 
                <div className="callSummary">{call.summary}</div>
              </div>

              <div className="callCost">
                {call.costBreakdown.analysisCostBreakdown.summary} $
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No calls found.</p>
      )}
    </div>
  );
};



export default App;
