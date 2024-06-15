import { describe, it, expect, jest } from '@jest/globals';
import TalentRequestService from '../../services/talentRequest.service.js';
import { User } from '../../models/user.model.js';
import TalentRequest from '../../models/talentRequest.model.js';
import { AuthFailureError, BadRequestError, NotFoundError } from '../../core/error.response.js';
import sendEmail from '../../middlewares/sendMail.js';

// Mock the dependencies
jest.mock('../../models/user.model.js');
jest.mock('../../models/talentRequest.model.js');
jest.mock('../../middlewares/sendMail.js');

jest.setTimeout(30000); // 30 seconds timeout

describe('TalentRequestService - upgradeRoleToTalent', () => {
    it('should throw NotFoundError if request does not exist', async () => {
        TalentRequest.findById.mockResolvedValue(null);

        await expect(TalentRequestService.upgradeRoleToTalent('adminId', 'requestId')).rejects.toThrow(NotFoundError);
    });

    it('should throw BadRequestError if request is already approved', async () => {
        TalentRequest.findById.mockResolvedValue({ status: 'approved' });

        await expect(TalentRequestService.upgradeRoleToTalent('adminId', 'requestId')).rejects.toThrow(BadRequestError);
    });

    it('should throw AuthFailureError if admin does not have permission', async () => {
        TalentRequest.findById.mockResolvedValue({ status: 'pending', userId: 'userId' });
        User.findById.mockResolvedValueOnce({ role: 'user' });

        await expect(TalentRequestService.upgradeRoleToTalent('adminId', 'requestId')).rejects.toThrow(AuthFailureError);
    });

    it('should throw NotFoundError if user does not exist', async () => {
        TalentRequest.findById.mockResolvedValue({ status: 'pending', userId: 'userId' });
        User.findById.mockResolvedValueOnce({ role: 'admin' }).mockResolvedValueOnce(null);

        await expect(TalentRequestService.upgradeRoleToTalent('adminId', 'requestId')).rejects.toThrow(NotFoundError);
    });

    it('should throw BadRequestError if user is already a talent', async () => {
        TalentRequest.findById.mockResolvedValue({ status: 'pending', userId: 'userId' });
        User.findById.mockResolvedValueOnce({ role: 'admin' }).mockResolvedValueOnce({ role: 'talent' });

        await expect(TalentRequestService.upgradeRoleToTalent('adminId', 'requestId')).rejects.toThrow(BadRequestError);
    });

    it('should update user role to talent and send email if all conditions are met', async () => {
        const mockRequest = {
            status: 'pending',
            userId: 'userId',
            save: jest.fn().mockResolvedValue(true)
        };
        TalentRequest.findById.mockResolvedValue(mockRequest);
        User.findById
            .mockResolvedValueOnce({ role: 'admin' })
            .mockResolvedValueOnce({ role: 'user', email: 'user@example.com' });
        User.findByIdAndUpdate.mockResolvedValue({ role: 'talent', _doc: { role: 'talent', email: 'user@example.com' } });

        const result = await TalentRequestService.upgradeRoleToTalent('adminId', 'requestId');

        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
            'userId',
            { $set: { role: 'talent' } },
            { new: true }
        );
        expect(mockRequest.save).toHaveBeenCalled();
        expect(sendEmail).toHaveBeenCalledWith('user@example.com', 'Role Updated', 'Your role has been updated to talent');
        expect(result).toHaveProperty('user');
    });

    it('should handle email sending failure gracefully', async () => {
        const mockRequest = {
            status: 'pending',
            userId: 'userId',
            save: jest.fn().mockResolvedValue(true)
        };
        TalentRequest.findById.mockResolvedValue(mockRequest);
        User.findById
            .mockResolvedValueOnce({ role: 'admin' })
            .mockResolvedValueOnce({ role: 'user', email: 'user@example.com' });
        User.findByIdAndUpdate.mockResolvedValue({ role: 'talent', _doc: { role: 'talent', email: 'user@example.com' } });
        sendEmail.mockRejectedValue(new Error('Email service error'));

        await expect(TalentRequestService.upgradeRoleToTalent('adminId', 'requestId')).rejects.toThrow('Email service error');
        expect(mockRequest.save).toHaveBeenCalled();
    });
});
