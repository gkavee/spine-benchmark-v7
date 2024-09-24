import { Bone, Spine } from "@pixi-spine/all-4.1";

export function analyzeSpineAttachments(spineInstance: Spine) {
    const skeleton = spineInstance.skeleton;
    const slots = skeleton.slots;
    const rootBone = skeleton.getRootBone();

    // Create the root <ul> element
    const treeRoot = document.createElement('ul');
    treeRoot.classList.add('bone-tree');

    // Create the tree structure
    createBoneTree(rootBone, treeRoot, 0);

    // Append the tree to the document body (or any other container)
    document.getElementById('skeletonStructureContainer')!.appendChild(treeRoot);

    // Log attachments that are too far from the root
    slots.forEach(slot => {
        const attachment = slot.attachment;
        if (attachment) {
            const bone = slot.bone;
            const distanceFromRoot = getBoneDistanceFromRoot(bone, rootBone);

            if (distanceFromRoot > 2) {
                console.log(`Attachment "${attachment.name}" in slot "${slot.data.name}" is ${distanceFromRoot} bones away from root.`);
            }
        }
    });
}

function createBoneTree(bone: Bone, parentElement: HTMLElement, depth: number) {
    const li = document.createElement('li');
    li.textContent = bone.data.name;
    
    if (depth > 2) {
        li.classList.add('deep-bone');
    }

    parentElement.appendChild(li);

    if (bone.children.length > 0) {
        const ul = document.createElement('ul');
        li.appendChild(ul);

        bone.children.forEach(childBone => {
            createBoneTree(childBone, ul, depth + 1);
        });
    }
}

function getBoneDistanceFromRoot(bone:Bone, rootBone: Bone) {
    let distance = 0;
    let currentBone = bone;

    while (currentBone && currentBone !== rootBone) {
        distance++;
        currentBone = currentBone.parent!;
    }

    return distance;
}