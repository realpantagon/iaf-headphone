import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [borrowHeadphoneId, setBorrowHeadphoneId] = useState("001");
  const [borrowInputId, setBorrowInputId] = useState("");

  const [returnHeadphoneId, setReturnHeadphoneId] = useState("");
  const [returnInputId, setReturnInputId] = useState("");

  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    try {
      const response = await axios.get(
        "https://api.airtable.com/v0/appo4h23QGedx6uR0/Headphone",
        {
          headers: {
            Authorization:
              "Bearer pat9aDF4Eh2hSEl8g.442a2a6963b0964593b0e1f8f0469049b275073158fc366e1187ff184f1beb7c",
            "Content-Type": "application/json",
          },
        }
      );
      setRecords(response.data.records);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleBorrowSubmit = async (e) => {
    e.preventDefault();
    setBorrowHeadphoneId(
      (parseInt(borrowHeadphoneId) + 1).toString().padStart(3, "0")
    );

    const record = {
      records: [
        {
          fields: {
            "Headphone ID": borrowHeadphoneId,
            "IAF-ID": borrowInputId,
            Status: "Borrow",
          },
        },
      ],
    };

    setBorrowInputId("");
    try {
      const response = await axios.post(
        "https://api.airtable.com/v0/appo4h23QGedx6uR0/Headphone",
        record,
        {
          headers: {
            Authorization:
              "Bearer pat9aDF4Eh2hSEl8g.442a2a6963b0964593b0e1f8f0469049b275073158fc366e1187ff184f1beb7c",
            "Content-Type": "application/json",
          },
        }
      );
      fetchRecords();
    } catch (error) {
      console.error("Error creating record:", error);
    }
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    setReturnHeadphoneId("");
    try {
      const response = await axios.get(
        `https://api.airtable.com/v0/appo4h23QGedx6uR0/Headphone?filterByFormula={Headphone ID}='${returnHeadphoneId}'`,
        {
          headers: {
            Authorization:
              "Bearer pat9aDF4Eh2hSEl8g.442a2a6963b0964593b0e1f8f0469049b275073158fc366e1187ff184f1beb7c",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.records.length > 0) {
        const recordId = response.data.records[0].id;

        const updateRecord = {
          fields: {
            Status: "Return",
          },
        };

        await axios.patch(
          `https://api.airtable.com/v0/appo4h23QGedx6uR0/Headphone/${recordId}`,
          updateRecord,
          {
            headers: {
              Authorization:
                "Bearer pat9aDF4Eh2hSEl8g.442a2a6963b0964593b0e1f8f0469049b275073158fc366e1187ff184f1beb7c",
              "Content-Type": "application/json",
            },
          }
        );
        fetchRecords();
      } else {
        console.log("Record not found.");
      }
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 p-4 rounded">
          <form onSubmit={handleBorrowSubmit}>
            <h1 className="text-2xl font-bold mb-4">BORROW</h1>
            <div className="mb-4">
              <label className="block mb-2">Headphone ID: </label>
              <input
                type="text"
                value={borrowHeadphoneId}
                onChange={(e) => setBorrowHeadphoneId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Enter ID: </label>
              <input
                type="text"
                value={borrowInputId}
                onChange={(e) => setBorrowInputId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </form>
        </div>
        <div className="bg-gray-100 p-4 rounded">
          <form onSubmit={handleReturnSubmit}>
            <h1 className="text-2xl font-bold mb-4">RETURN</h1>
            <div className="mb-4">
              <label className="block mb-2">Headphone ID: </label>
              <input
                type="text"
                value={returnHeadphoneId}
                onChange={(e) => setReturnHeadphoneId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Record List</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-100 border-b">Headphone ID</th>
              <th className="px-4 py-2 bg-gray-100 border-b">Status</th>
            </tr>
          </thead>
          <tbody className="max-h-64 overflow-y-auto">
            {records
              .sort((a, b) =>
                a.fields["Headphone ID"].localeCompare(b.fields["Headphone ID"])
              )
              .map((record) => (
                <tr key={record.id}>
                  <td className="px-4 py-2 border-b">{record.fields["Headphone ID"]}</td>
                  <td
                    className={`px-4 py-2 border-b ${
                      record.fields["Status"] === "Return" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {record.fields["Status"]}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
