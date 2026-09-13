import { inject, Service } from '@angular/core';
import { MediaFolder, MediaRef } from '../../../shared/models';
import { ApiClient } from '../api-client';
import { API_ROUTES } from '../api-routes';
import { MediaApi } from '../media-api';

@Service({ autoProvided: false })
export class HttpMediaApi extends MediaApi {
  private readonly api = inject(ApiClient);

  upload(file: File, folder: MediaFolder): Promise<MediaRef> {
    return this.api.upload<MediaRef>(API_ROUTES.media.upload(folder), file);
  }

  async remove(ref: MediaRef): Promise<void> {
    // Statische Verweise (ohne Id) gehoeren nicht dem Backend.
    if (!ref.id) {
      return;
    }
    await this.api.delete(API_ROUTES.media.item(ref.id));
  }
}
