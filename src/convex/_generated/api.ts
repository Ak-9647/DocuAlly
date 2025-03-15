// Mock API for development purposes
export const api = {
  documents: {
    getStorageId: 'documents:getStorageId',
    getById: 'documents:getById',
    create: 'documents:create',
    list: 'documents:list',
    update: 'documents:update',
    delete: 'documents:delete',
    getByUser: 'documents:getByUser',
  },
  files: {
    generateUploadUrl: 'files:generateUploadUrl',
    saveFileMetadata: 'files:saveFileMetadata',
    getFileUrl: 'files:getFileUrl',
    getThumbnailUrl: 'files:getThumbnailUrl',
  },
  signatureFields: {
    create: 'signatureFields:create',
    getByDocument: 'signatureFields:getByDocument',
    update: 'signatureFields:update',
    delete: 'signatureFields:delete',
  },
  users: {
    getById: 'users:getById',
    create: 'users:create',
    update: 'users:update',
  },
  emailLogs: {
    create: 'emailLogs:create',
    updateStatus: 'emailLogs:updateStatus',
    getByDocument: 'emailLogs:getByDocument',
    getByRecipient: 'emailLogs:getByRecipient',
    getPendingReminders: 'emailLogs:getPendingReminders',
  },
  scheduledTasks: {
    scheduleReminder: 'scheduledTasks:scheduleReminder',
    processSendReminder: 'scheduledTasks:processSendReminder',
  }
}; 