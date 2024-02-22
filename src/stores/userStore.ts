import { fetchAuthenticatedUser, type AuthenticatedUser, useApi } from "@/api/api";
import { useAsyncState } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref<AuthenticatedUser | null>();
  const userStorageCredentials = ref({
    ID: localStorage.getItem('authenticatedUserId'),
    authID: localStorage.getItem('authenticatedUser')
  });

  const getUser = computed(() => user.value);
  const getUserStorageCredentials = computed(() => userStorageCredentials.value);
  const isAuthenticated = computed(() => getUserStorageCredentials.value.authID === getUser.value?.auth);

  function setUserStorageCrendentials(credentials: { id: string, auth: string }) {
    localStorage.setItem('authenticatedUserId', credentials.id);
    localStorage.setItem('authenticatedUser', credentials.auth);

    userStorageCredentials.value.ID = localStorage.getItem('authenticatedUserId')
    userStorageCredentials.value.authID = localStorage.getItem('authenticatedUser')
  }

  const { state: userInfo, execute: fetchAuthenticatedUserInfo } = useAsyncState(fetchAuthenticatedUser, null, {
    immediate: false,
  });

  

  async function fetchUserTest(code: string | null) {
    if (user.value) {
      return;
    };

    const { data: outhData, execute: fetchAuthenticatedUserInfoTest } = useApi<AuthenticatedUser>(
      `/Auth/?code=${code}`, 
      { immediate: false }
    )

    await fetchAuthenticatedUserInfoTest()
    user.value = outhData.value;

    setUserStorageCrendentials(outhData.value)
  }

  async function fetchUser() {
    if (user.value) {
      return;
    };
   
    await fetchAuthenticatedUserInfo(0, getUserStorageCredentials.value)
    user.value = userInfo.value;
    
  }

  if (getUserStorageCredentials.value.ID && getUserStorageCredentials.value.authID) {
    fetchUser()
  }

  return {
    user,
    userStorageCredentials,

    getUser,
    getUserStorageCredentials,
    isAuthenticated,

    setUserStorageCrendentials,
    fetchUser,
    fetchUserTest,
  };
})