import { Service } from '@angular/core';
import { MediaFolder, MediaRef } from '../../../shared/models';
import { readFileAsDataUrl } from '../../../shared/utils/file';
import { createId } from '../../../shared/utils/id';
import { MediaApi } from '../media-api';
import { simulateLatency } from './mock-latency';

/** Bis zu dieser Groesse wird die Datei als Data-URL eingebettet und ueberlebt so einen Reload. */
const INLINE_LIMIT_BYTES = 2 * 1024 * 1024;

@Service({ autoProvided: false })
export class MockMediaApi extends MediaApi {
  async upload(file: File, folder: MediaFolder): Promise<MediaRef> {
    await simulateLatency(undefined, 300, 900);
    const url =
      file.size <= INLINE_LIMIT_BYTES ? await readFileAsDataUrl(file) : URL.createObjectURL(file);
    return {
      id: createId(`mock-${folder}`),
      url,
      name: file.name,
      contentType: file.type || 'application/octet-stream',
      size: file.size,
    };
  }

  async remove(ref: MediaRef): Promise<void> {
    await simulateLatency();
    if (ref.url.startsWith('blob:')) {
      URL.revokeObjectURL(ref.url);
    }
  }
}
