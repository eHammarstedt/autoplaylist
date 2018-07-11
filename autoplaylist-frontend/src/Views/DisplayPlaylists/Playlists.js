import React from 'react'

const Playlists = (props) => (
    <div>
        <ul>
            {props.list && props.list.map(item => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    </div>
)

export default Playlists