import { useState } from 'react';
import * as shareService from '../../services/shareService';

function ShareSection({ tripId }) {
  const [shareAccessType, setShareAccessType] = useState('VIEW');
  const [shareLink, setShareLink] = useState('');

  const handleCreateShareLink = async () => {
    const data = await shareService.createShareToken(tripId, shareAccessType);
    const link = `${window.location.origin}/share/${data.token}`;
    setShareLink(link);
  };

  return (
    <section>
      <h2>Deljenje</h2>
      <select
        value={shareAccessType}
        onChange={(e) => setShareAccessType(e.target.value)}
      >
        <option value="VIEW">Samo pregled</option>
        <option value="EDIT">Pregled i uređivanje</option>
      </select>
      <button onClick={handleCreateShareLink}>Generiši link za deljenje</button>

      {shareLink && (
        <p>
          Link:{' '}
          <input type="text" readOnly value={shareLink} style={{ width: '400px' }} />
          <button onClick={() => navigator.clipboard.writeText(shareLink)}>
            Kopiraj
          </button>
        </p>
      )}
    </section>
  );
}

export default ShareSection;