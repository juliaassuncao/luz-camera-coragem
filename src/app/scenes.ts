export const SCENES = ['opening', 'backstage', 'filming', 'screening', 'finale', 'letter'] as const;
export type SceneId = (typeof SCENES)[number];
export type Genre = 'drama' | 'action' | null;

export const SCENE_LABELS: Record<SceneId, string> = {
  opening: '01 · O convite',
  backstage: '02 · Bastidores',
  filming: '03 · A filmagem',
  screening: '04 · Pré-estreia',
  finale: '05 · A última tomada',
  letter: '06 · A cartinha',
};
