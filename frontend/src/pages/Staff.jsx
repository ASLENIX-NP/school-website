const staffs = [
    {
      id: 1,
      name: "Binod Subedi",
      position: "Principal",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      qualification: "M.Ed",
    },
    {
      id: 2,
      name: "Amul Shrestha",
      position: "Vice Principal",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
      qualification: "M.Ed",
    },
    {
      id: 3,
      name: "Prem Hamal",
      position: "Science Teacher",
      image:
        "https://images.unsplash.com/photo-1504593811423-6dd665756598",
      qualification: "B.Sc, B.Ed",
    },
    {
      id: 4,
      name: "Nirmala Aryal",
      position: "Coordinator",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      qualification: "M.A English",
    },
  ];
  
  export default function Staff() {
    return (
      <section className="bg-slate-50 min-h-screen py-24">
        <div className="max-w-7xl mx-auto px-6">
  
          <div className="mb-12">
            <h1 className="text-5xl font-bold">
              Our Staff & Members
            </h1>
  
            <div className="w-24 h-1 bg-green-600 mt-4 rounded-full" />
          </div>
  
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
  
            {staffs.map((staff) => (
              <div
                key={staff.id}
                className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition"
              >
                <img
                  src={staff.image}
                  alt={staff.name}
                  className="w-full h-72 object-cover"
                />
  
                <div className="p-5">
                  <h3 className="text-xl font-bold">
                    {staff.name}
                  </h3>
  
                  <p className="text-green-700 font-medium">
                    {staff.position}
                  </p>
  
                  <p className="text-slate-500 mt-2">
                    {staff.qualification}
                  </p>
  
                  <button className="mt-4 w-full bg-blue-900 text-white py-2 rounded-lg">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
  
          </div>
  
        </div>
      </section>
    );
  }