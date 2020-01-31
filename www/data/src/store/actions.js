import chatkit from '../chatkit.js';

function handleError(commit, error){
  const message = error.message || error.info.error_description;
  commit('setError', message)
}

export default{
  async login({commit, state}, userId){
    try{
      commit('setError', '');
      commit('setLoading', true);

      const currentUser = await chatkit.connectUser(userId);
      commit('setUser', {
        username: currentUser.id,
        name: currentUser.name
      });

      const rooms = currentUser.rooms.map(room => ({
        id: room.id,
        name: room.name
      }));
      commit('setRooms', rooms)

      const activeRoom = state.activeRoom || rooms[0];
      commit('setActiveRoom', {
        id: activeRoom.id,
        name: activeRoom.name
      });

      await chatkit.subscribeToRoom(activeRoom.id)

      commit('setReconnect', false);

      return true;
    }catch(e){
      handleError(commit, e);
    }finally{
      commit('setLoading', false);
    }
  },
  async changeRoom({ commit }, roomId){
    try{
      const {id, name} = await chatkit.subscribeToRoom(roomId);
      commit('setActiveRoom', {id, name});
    }catch(e){
      handleError(commit, e);
    }
  },
  async sendMessage({commit}, message){
    try{
      commit('setError', '');
      commit('setSending', '');
      const messageId = await chatkit.sendMessage(message);
      return messageId;
    }catch(e){
      handleError(commit, e);
    }finally{
      commit('setSending', false);
    }
  },
  async logout({commit}){
    commit('reset');
    chatkit.disconnectUser();
    window.localStorage.clear();
  }
}