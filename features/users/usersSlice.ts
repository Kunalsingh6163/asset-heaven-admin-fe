import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userService } from '@/services/api/userService';
import { User, UsersState } from '@/types/user.types';

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  detailsLoading: false,
  deletingUserId: null,
  error: null,
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const users = await userService.getAllUsers();
      return users;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch users');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id: string, { rejectWithValue }) => {
    try {
      const user = await userService.getUserById(id);
      return user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user');
    }
  }
);

export const softDeleteUser = createAsyncThunk(
  'users/softDeleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      await userService.softDeleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to soft-delete user');
    }
  }
);

export const permanentlyDeleteUser = createAsyncThunk(
  'users/permanentlyDeleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      await userService.permanentlyDeleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to permanently delete user');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch user by ID
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
        state.selectedUser = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.detailsLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload as string;
      });

    // Soft delete user
    builder
      .addCase(softDeleteUser.pending, (state, action) => {
        state.deletingUserId = action.meta.arg;
        state.error = null;
      })
      .addCase(softDeleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.deletingUserId = null;
        state.users = state.users.filter(user => user._id !== action.payload);
        if (state.selectedUser?._id === action.payload) state.selectedUser = null;
      })
      .addCase(softDeleteUser.rejected, (state, action) => {
        state.deletingUserId = null;
        state.error = action.payload as string;
      });

    // Permanent delete user
    builder
      .addCase(permanentlyDeleteUser.pending, (state, action) => {
        state.deletingUserId = action.meta.arg;
        state.error = null;
      })
      .addCase(permanentlyDeleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.deletingUserId = null;
        state.users = state.users.filter(user => user._id !== action.payload);
        if (state.selectedUser?._id === action.payload) state.selectedUser = null;
      })
      .addCase(permanentlyDeleteUser.rejected, (state, action) => {
        state.deletingUserId = null;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedUser, clearError } = usersSlice.actions;
export default usersSlice.reducer;
