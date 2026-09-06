import mongoose, { Schema, Document } from 'mongoose';

export interface IOfficialMpladsRecord extends Document {
  sourceRecordId: string;
  sourceName: string;
  sourceUrl: string;
  importedAt: Date;
  mpName: string;
  work: string;
  category: string;
  state: string;
  constituency: string;
  ida: string;
  city: string;
  ward: string;
  block: string;
  village: string;
  recommendedDate: string;
  allocationAmount: string;
  idaApproval: string;
  status: string;
  house: string;
  normalized: boolean;
  normalizedProjectId?: string;
}

const OfficialMpladsRecordSchema = new Schema<IOfficialMpladsRecord>(
  {
    sourceRecordId: { type: String, required: true, unique: true, index: true },
    sourceName: { type: String, required: true },
    sourceUrl: { type: String, required: true },
    importedAt: { type: Date, default: Date.now },
    mpName: { type: String, default: '' },
    work: { type: String, default: '' },
    category: { type: String, default: '' },
    state: { type: String, default: '' },
    constituency: { type: String, default: '' },
    ida: { type: String, default: '' },
    city: { type: String, default: '' },
    ward: { type: String, default: '' },
    block: { type: String, default: '' },
    village: { type: String, default: '' },
    recommendedDate: { type: String, default: '' },
    allocationAmount: { type: String, default: '0' },
    idaApproval: { type: String, default: '' },
    status: { type: String, default: '' },
    house: { type: String, default: '' },
    normalized: { type: Boolean, default: false, index: true },
    normalizedProjectId: { type: String, index: true },
  },
  { timestamps: true }
);

export const OfficialMpladsRecord = mongoose.model<IOfficialMpladsRecord>(
  'OfficialMpladsRecord',
  OfficialMpladsRecordSchema
);
