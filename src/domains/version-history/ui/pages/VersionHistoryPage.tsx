import dayjs from 'dayjs';
import { useAuth } from '../../../../context/AuthContext';
import { linkifyText } from '../../../../utils/linkify';
const VersionHistoryPage = () => {
  const { version, loading } = useAuth();
  return (
    <div className="container p-4 mt-3 defult-background ">
      <div className="d-flex mx-auto justify-content-between mb-3 align-items-center">
        <h2>
          Latest release - {version?.version} -
          {dayjs(version?.releaseDate, 'DD/MM/YYYY HH:mm:ss').format(
            'DD MMM YYYY'
          )}
        </h2>
        {/* <VersionHistoryForm onCreated={handleNewVersionAdded} /> */}
      </div>
      {loading && <p className="text-muted mt-3 mb-0">Loading...</p>}

      <div className="row mt-3">
        <div className="col-md-6">
          <h4>Highlights</h4>
          <ul className="mb-0 ps-3">
            {version?.highlights.map((line, idx) => (
              <li key={idx}>{linkifyText(line)}</li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h4>Fixes</h4>
          <ul className="mb-0 ps-3">
            {version?.fixes.map((line: string, idx: number) => (
              <li key={idx}>{linkifyText(line)}</li>
            ))}
          </ul>
        </div>
      </div>
      {/*{showModal && (
        <VersionHistoryEdit
          key={editItem?.uuid || editItem?.version}
          version={editItem}
          onClose={handleCloseModal}
          onDeleted={handleVersionDeleted}
          onUpdated={handleVersionUpdated}
        />
      )} */}
    </div>
  );
};

export default VersionHistoryPage;
