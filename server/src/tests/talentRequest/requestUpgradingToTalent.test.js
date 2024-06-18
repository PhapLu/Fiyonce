import { User } from '../../models/user.model.js';
import TalentRequest from '../../models/talentRequest.model.js';
import { BadRequestError, NotFoundError, AuthFailureError } from '../../core/error.response.js';
import { compressAndUploadImage, deleteFileByPublicId, extractPublicIdFromUrl } from '../../utils/cloud.util.js';
import TalentRequestService from '../../services/talentRequest.service.js';

// Mock the dependencies
jest.mock('../../models/user.model.js');
jest.mock('../../models/talentRequest.model.js');
jest.mock('../../middlewares/sendMail.js');
jest.mock('../../utils/cloud.util.js');

describe('TalentRequestService', () => {
    describe('requestUpgradingToTalent', () => {
        it('should throw NotFoundError if user does not exist', async () => {
            User.findById.mockResolvedValue(null);
            const req = { body: {}, files: {} };

            await expect(TalentRequestService.requestUpgradingToTalent('userId', req)).rejects.toThrow(NotFoundError);
        });

        it('should throw BadRequestError if user is already a talent', async () => {
            User.findById.mockResolvedValue({ role: 'talent' });
            const req = { body: {}, files: {} };

            await expect(TalentRequestService.requestUpgradingToTalent('userId', req)).rejects.toThrow(BadRequestError);
        });

        it('should throw BadRequestError if required fields are missing', async () => {
            User.findById.mockResolvedValue({ role: 'user' });
            const req = { body: {}, files: {} };

            await expect(TalentRequestService.requestUpgradingToTalent('userId', req)).rejects.toThrow(BadRequestError);
        });

        it('should throw BadRequestError if artwork files are missing', async () => {
            User.findById.mockResolvedValue({ role: 'user' });
            const req = { body: { stageName: 'StageName', portfolioLink: 'http://portfolio.com' }, files: {} };

            await expect(TalentRequestService.requestUpgradingToTalent('userId', req)).rejects.toThrow(BadRequestError);
        });

        it('should process the talent request correctly if all conditions are met', async () => {
            User.findById.mockResolvedValue({ role: 'user' });
            TalentRequest.findOne.mockResolvedValue(null);
            compressAndUploadImage.mockResolvedValue({ secure_url: 'http://example.com/artwork.jpg' });

            const req = {
                body: { stageName: 'StageName', portfolioLink: 'http://portfolio.com' },
                files: {
                    files: [
                        { buffer: Buffer.from('file1'), originalname: 'file1.jpg' },
                        { buffer: Buffer.from('file2'), originalname: 'file2.jpg' }
                    ]
                }
            };

            TalentRequest.prototype.save = jest.fn().mockResolvedValue(true);

            const result = await TalentRequestService.requestUpgradingToTalent('userId', req);

            expect(result).toHaveProperty('talentRequest');
            expect(TalentRequest.prototype.save).toHaveBeenCalled();
        });

        it('should handle file upload failure gracefully', async () => {
            User.findById.mockResolvedValue({ role: 'user' });
            TalentRequest.findOne.mockResolvedValue(null);
            compressAndUploadImage.mockRejectedValue(new Error('Upload failed'));

            const req = {
                body: { stageName: 'StageName', portfolioLink: 'http://portfolio.com' },
                files: {
                    files: [
                        { buffer: Buffer.from('file1'), originalname: 'file1.jpg' },
                        { buffer: Buffer.from('file2'), originalname: 'file2.jpg' }
                    ]
                }
            };

            await expect(TalentRequestService.requestUpgradingToTalent('userId', req)).rejects.toThrow('File upload or database save failed');
        });
    });
});
