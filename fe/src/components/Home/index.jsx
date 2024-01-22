import { Link } from 'react-router-dom';
import React from 'react';

export const HomePage = () => {
    return (
        <div>
            Collaborate
            <button>
                <Link to="/write">
                    Write
                </Link>
            </button>
            <button>
                <Link to="/draw">
                    Draw
                </Link>
            </button>
        </div>
    )
};
