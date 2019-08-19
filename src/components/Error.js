import React from 'react';

export default function Error({ error }) {
    return <div>
        <h2>Uh Oh!</h2>
        <p>We encountered a critical error, please refresh
        the application and try again. Our team will be notified of the error. We are working hard to resolve any issues.</p>
        <pre>{JSON.stringify(error, null, '   ')}</pre>
    </div>
}
