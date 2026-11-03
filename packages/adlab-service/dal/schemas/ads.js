import { db } from '../../lib/drivers/database.js';
import * as Constants from '../../lib/constants.js';

export { validateDBObjectId } from '../../lib/util.js';

const { Schema } = db;

const adSchema = new Schema(
  {
    adName: String,
    platformAdId: { type: String, default: null },
    adGroupId: { type: Schema.Types.ObjectId, ref: 'AdGroup', required: true },
    platformAdGroupId: {
      type: String,
      ref: 'AdGroup.platformId',
      required: true,
    },
    status: {
      type: String,
      enum: Constants.AVAILABLE_STATUSES,
    },
    createdBy: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    updatedBy: { type: String, default: null },
    updatedOn: { type: Date, default: null },
  },
  { strict: false },
);

adSchema.pre('save', function (next) {
  if (this.updatedBy) {
    this.updatedOn = Date.now();
  }
  next();
});

adSchema.pre('insertMany', (next, docs) => {
  docs.forEach((doc) => {
    if (doc.updatedBy) {
      doc.updatedOn = Date.now();
    }
  });
  next();
});
export const AdModel = db.model('Ad', adSchema, 'ads');
