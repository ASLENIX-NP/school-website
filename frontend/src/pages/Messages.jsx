const founderImage =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a";

const principalImage =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e";

export default function Messages() {
  return (
    <section className="bg-slate-50 min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900">
            Messages From Leadership
          </h1>

          <div className="w-24 h-1 bg-green-600 mx-auto mt-4 rounded-full"></div>

          <p className="mt-5 text-slate-600">
            Inspiring words from our Founder and Principal.
          </p>
        </div>

        {/* Founder Message */}
        <div className="bg-white rounded-3xl shadow-lg p-8 lg:p-12 mb-16">
          <h2 className="text-4xl font-bold mb-10">
            Founder’s Message
          </h2>

          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-slate-700 leading-8">
                After crossing a silver jubilee of the school,
                Baljagriti has established itself as one of the
                leading educational institutions of the region.
                Our mission is to provide quality education,
                nurture responsible citizens, and prepare
                students for a globally connected future.
              </p>

              <div className="mt-8">
                <h3 className="text-2xl font-bold">
                  Dinesh Prasad Bhandari
                </h3>

                <p className="text-green-700 font-semibold">
                  Founder / Director
                </p>
              </div>
            </div>

            <img
              src={founderImage}
              alt="Founder"
              className="rounded-3xl w-full h-[500px] object-cover"
            />
          </div>
        </div>

        {/* Principal Message */}
        <div className="bg-white rounded-3xl shadow-lg p-8 lg:p-12">
          <h2 className="text-4xl font-bold mb-10">
            Principal's Message
          </h2>

          <div className="grid lg:grid-cols-2 gap-10 items-center">

            <img
              src={principalImage}
              alt="Principal"
              className="rounded-3xl w-full h-[500px] object-cover"
            />

            <div>
              <p className="text-slate-700 leading-8">
                Education is the foundation of a successful
                future. At Baljagriti, we are committed to
                providing students with academic excellence,
                strong moral values, leadership skills,
                and opportunities for holistic development.
              </p>

              <div className="mt-8">
                <h3 className="text-2xl font-bold">
                  Binod Subedi
                </h3>

                <p className="text-green-700 font-semibold">
                  Principal
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}