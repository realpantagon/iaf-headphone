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

    let curId = (parseInt(borrowHeadphoneId) + 1)
      .toString()
      .padStart(3, "0");

      const numbersToSkip = [
        "401", "402", "403", "404", "405", "406", "407", "408", "409", "410",
        "411", "412", "413", "414", "415", "53", "114"
      ];
    let nextId = (parseInt(borrowHeadphoneId) + 1)
      .toString()
      .padStart(3, "0");

      while (numbersToSkip.includes(nextId)) {
        nextId = (parseInt(nextId) + 1).toString().padStart(3, "0");
      }

    setBorrowHeadphoneId(nextId);

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
        // Find the latest record with the given headphone ID
        const latestRecord = response.data.records.reduce((latest, current) => {
          return new Date(current.createdTime) > new Date(latest.createdTime)
            ? current
            : latest;
        });

        const recordId = latestRecord.id;

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
    <div className="mx-auto p-6 bg-gray-100 min-h-screen w-full">
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded shadow">
          <form onSubmit={handleBorrowSubmit}>
            <h1 className="text-3xl font-bold mb-6 text-center text-amber-500">
              Borrow Headphone
            </h1>
            <div className="mb-6">
              <label className="block mb-2 text-lg font-semibold text-gray-700">
                Headphone ID:
              </label>
              <input
                type="text"
                value={borrowHeadphoneId}
                onChange={(e) => setBorrowHeadphoneId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleBorrowSubmit(e);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-lg font-semibold text-gray-700">
                IAF-ID:
              </label>
              <input
                type="text"
                value={borrowInputId}
                onChange={(e) => setBorrowInputId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleBorrowSubmit(e);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </form>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <form onSubmit={handleReturnSubmit}>
            <h1 className="text-3xl font-bold mb-6 text-center text-emerald-800">
              Return Headphone
            </h1>
            <div className="mb-6">
              <label className="block mb-2 text-lg font-semibold text-gray-700">
                Headphone ID:
              </label>
              <input
                type="text"
                value={returnHeadphoneId}
                onChange={(e) => setReturnHeadphoneId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleReturnSubmit(e);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </form>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-800">
          Headphone Records
        </h2>
        <table className="w-full border-collapse bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-6 py-4 bg-emerald-800 text-white font-semibold border-b">
                Headphone ID
              </th>
              <th className="px-6 py-4 bg-emerald-800 text-white font-semibold border-b">
                IAF-ID
              </th>
              <th className="px-6 py-4 bg-emerald-800 text-white font-semibold border-b">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="max-h-64 overflow-y-auto">
  {records
    .sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime))
    .map((record) => (
      <tr key={record.id} className="border-b hover:bg-gray-100">
        <td className="px-6 py-4 text-gray-800 text-center">
          {record.fields["Headphone ID"]}
        </td>
        <td className="px-6 py-4 text-gray-800 text-center">
          {record.fields["IAF-ID"]}
        </td>
        <td
          className={`px-6 py-4 font-semibold text-center ${
            record.fields["Status"] === "Return"
              ? "text-emerald-600"
              : "text-red-600"
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