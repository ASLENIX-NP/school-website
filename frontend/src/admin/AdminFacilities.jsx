import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminFacilities() {
  const [pageSettings, setPageSettings] = useState({
    badge: "School Facilities",
    title1: "Learning Beyond",
    title2: "Classrooms",
    description:
      "Baljagriti provides modern facilities that create an engaging learning environment for every student.",
  });

  const [facilities, setFacilities] = useState([
    {
      id: 1,
      emoji: "📚",
      category: "Digital Learning",
      title: "E-Library",
      description: "Access thousands of digital books.",
      details: "Facility details here",
      color: "#D71920",
    },
  ]);

  useEffect(() => {
    fetchFacilities();
  }, []);
  
  const fetchFacilities = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/facilities"
      );
  
      const result = await response.json();
  
      if (result.success) {
        setFacilities(result.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addFacility = () => {
    setFacilities([
      {
        id: Date.now(),
        emoji: "🏫",
        category: "",
        title: "",
        description: "",
        details: "",
        color: "#168A3A",
      },
      ...facilities,
    ]);
  };

  const updateFacility = (id, field, value) => {
    setFacilities(
      facilities.map((facility) =>
        facility.id === id
          ? { ...facility, [field]: value }
          : facility
      )
    );
  };

  const deleteFacility = (id) => {
    setFacilities(
      facilities.filter((facility) => facility.id !== id)
    );
  };

  const saveChanges = async () => {
    try {
      // remove old records
      await fetch(
        "http://localhost:5000/api/facilities",
        {
          method: "DELETE",
        }
      );

      // insert current records
      for (const facility of facilities) {
        await fetch(
          "http://localhost:5000/api/facilities",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              emoji: facility.emoji,
              category: facility.category,
              title: facility.title,
              description: facility.description,
              details: facility.details,
              color: facility.color,
            }),
          }
        );
      }

      alert("Facilities saved successfully");
      fetchFacilities();
    } catch (error) {
      console.error(error);
      alert("Failed to save");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* TOP BAR */}
      <div className="h-[80px] bg-slate-900 flex items-center">
        <div className="max-w-[1600px] mx-auto w-full px-8 flex justify-between">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 font-semibold"
            style={{
              color: "#FFFFFF",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <button
            onClick={saveChanges}
            className="px-6 py-3 rounded-xl bg-yellow-300 font-bold flex items-center gap-2"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-8">
        <div className="grid lg:grid-cols-[520px_1fr] gap-8">

          {/* LEFT SIDE */}
          <div className="space-y-6">
            <button
              onClick={addFacility}
              className="w-full p-4 rounded-2xl bg-blue-500 text-white font-bold flex justify-center gap-2"
            >
              <Plus size={18} />
              Add Facility
            </button>

            {facilities.map((facility, index) => (
              <div
                key={facility.id}
                className="bg-white rounded-3xl p-6 border"
              >
                <div className="flex justify-between mb-5">
                  <h3 className="font-bold text-xl">
                    Facility #{index + 1}
                  </h3>

                  <button
                    onClick={() => deleteFacility(facility.id)}
                  >
                    <Trash2 className="text-red-500" />
                  </button>
                </div>

                <div className="space-y-3">
                  <input
                    className="w-full border rounded-xl p-3"
                    placeholder="Emoji"
                    value={facility.emoji}
                    onChange={(e) =>
                      updateFacility(
                        facility.id,
                        "emoji",
                        e.target.value
                      )
                    }
                  />

                  <input
                    className="w-full border rounded-xl p-3"
                    placeholder="Category"
                    value={facility.category}
                    onChange={(e) =>
                      updateFacility(
                        facility.id,
                        "category",
                        e.target.value
                      )
                    }
                  />

                  <input
                    className="w-full border rounded-xl p-3"
                    placeholder="Title"
                    value={facility.title}
                    onChange={(e) =>
                      updateFacility(
                        facility.id,
                        "title",
                        e.target.value
                      )
                    }
                  />

                  <textarea
                    rows={3}
                    className="w-full border rounded-xl p-3"
                    placeholder="Description"
                    value={facility.description}
                    onChange={(e) =>
                      updateFacility(
                        facility.id,
                        "description",
                        e.target.value
                      )
                    }
                  />

                  <textarea
                    rows={4}
                    className="w-full border rounded-xl p-3"
                    placeholder="Details"
                    value={facility.details}
                    onChange={(e) =>
                      updateFacility(
                        facility.id,
                        "details",
                        e.target.value
                      )
                    }
                  />

                  <select
                    className="w-full border rounded-xl p-3"
                    value={facility.color}
                    onChange={(e) =>
                      updateFacility(
                        facility.id,
                        "color",
                        e.target.value
                      )
                    }
                  >
                    <option value="#D71920">Red</option>
                    <option value="#168A3A">Green</option>
                    <option value="#4B2E83">Purple</option>
                    <option value="#F59E0B">Orange</option>
                  </select>
                </div>
              </div>
            ))}

            {/* PAGE SETTINGS */}
            <div className="bg-white rounded-3xl p-6 border">
              <h2 className="font-bold text-xl mb-4">
                Page Settings
              </h2>

              <input
                className="w-full border rounded-xl p-3 mb-3"
                placeholder="Badge"
                value={pageSettings.badge}
                onChange={(e) =>
                  setPageSettings({
                    ...pageSettings,
                    badge: e.target.value,
                  })
                }
              />

              <input
                className="w-full border rounded-xl p-3 mb-3"
                placeholder="Title 1"
                value={pageSettings.title1}
                onChange={(e) =>
                  setPageSettings({
                    ...pageSettings,
                    title1: e.target.value,
                  })
                }
              />

              <input
                className="w-full border rounded-xl p-3 mb-3"
                placeholder="Title 2"
                value={pageSettings.title2}
                onChange={(e) =>
                  setPageSettings({
                    ...pageSettings,
                    title2: e.target.value,
                  })
                }
              />

              <textarea
                rows={3}
                className="w-full border rounded-xl p-3"
                placeholder="Description"
                value={pageSettings.description}
                onChange={(e) =>
                  setPageSettings({
                    ...pageSettings,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* RIGHT SIDE LIVE PREVIEW */}
          <div className="sticky top-6 h-[90vh] overflow-y-auto">
            <div className="bg-white rounded-3xl p-8">
              <div className="text-center mb-16">
                <span className="bg-green-100 px-4 py-2 rounded-full">
                  {pageSettings.badge}
                </span>

                <h1 className="text-6xl font-black mt-6">
                  {pageSettings.title1}{" "}
                  <span className="text-red-600">
                    {pageSettings.title2}
                  </span>
                </h1>

                <p className="mt-5 text-slate-500">
                  {pageSettings.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {facilities.map((facility) => (
                  <div
                    key={facility.id}
                    className="rounded-3xl p-6 border"
                    style={{
                      borderColor: facility.color,
                    }}
                  >
                    <div className="text-4xl mb-4">
                      {facility.emoji}
                    </div>

                    <span
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background: `${facility.color}20`,
                        color: facility.color,
                      }}
                    >
                      {facility.category}
                    </span>

                    <h3 className="text-2xl font-bold mt-4">
                      {facility.title}
                    </h3>

                    <p className="mt-4 text-slate-600">
                      {facility.description}
                    </p>

                    <button
                      className="mt-5 font-semibold"
                      style={{
                        color: facility.color,
                      }}
                    >
                      Learn More →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}