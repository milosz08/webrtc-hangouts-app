'use strict';

/*
 * Part of Silesian University of Technology project.
 * Created only for learning purposes.
 */
import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Peer } from 'peerjs';
import PropTypes from 'prop-types';

const PeerContext = createContext(null);

export const usePeer = () => {
  return useContext(PeerContext);
};

const PeerProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [peer, setPeer] = useState(null);

  const createPeerConnection = (afterConnectCallback, afterError) => {
    const url = new URL(window.reactEnvClient.peerServerUrl);
    let config = { host: url.hostname, secure: true };
    if (url.port) {
      config = { host: 'localhost', port: url.port };
    }
    fetchIceServers().then(iceServers => {
      if (iceServers.length > 0) {
        const peer = new Peer(undefined, {
          ...config,
          path: '/peerjs',
          config: {
            iceServers,
          },
        });
        peer.on('open', id => {
          afterConnectCallback(id);
          setPeer(peer);
        });
      } else {
        afterError();
      }
    });
  };

  const fetchIceServers = async () => {
    try {
      const { data } = await axios.get(
        `${window.reactEnvClient.serverUrl}/api/v1/ice`
      );
      if (data.length === 0) {
        enqueueSnackbar('Unable to fetch connection details');
      }
      return data;
    } catch (error) {
      enqueueSnackbar('Unable to fetch connection details');
      return [];
    }
  };

  return (
    <PeerContext.Provider value={{ peer, createPeerConnection }}>
      {children}
    </PeerContext.Provider>
  );
};

PeerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PeerProvider;
