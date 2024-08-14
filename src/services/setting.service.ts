import CommonService from './common.service';

class SettingService extends CommonService {
  async siteTitle() {
    const { data } = await this.post({
      query:
      ` query{
          generalSettings {
            title
        }
      }`
    })

    return data?.generalSettings?.title || ''
  }
}

export const settingService = new SettingService();