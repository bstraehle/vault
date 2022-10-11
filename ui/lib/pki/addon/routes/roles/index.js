import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class RolesIndexRoute extends Route {
  @service store;
  @service secretMountPath;
  @service pathHelp;

  beforeModel() {
    // Must call this promise before the model hook otherwise it doesn't add OpenApi to record.
    return this.pathHelp.getNewModel('pki/pki-role-engine', 'pki');
  }

  model() {
    return this.store
      .query('pki/pki-role-engine', { backend: this.secretMountPath.currentPath })
      .then((roleModel) => {
        return { roleModel, parentModel: this.modelFor('roles') };
      })
      .catch((err) => {
        if (err.httpStatus === 404) {
          return [];
        } else {
          throw err;
        }
      });
  }
}
