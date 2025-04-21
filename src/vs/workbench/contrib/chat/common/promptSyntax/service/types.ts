/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from '../../../../../../base/common/uri.js';
import { ITextModel } from '../../../../../../editor/common/model.js';
import { IDisposable } from '../../../../../../base/common/lifecycle.js';
import { TextModelPromptParser } from '../parsers/textModelPromptParser.js';
import { createDecorator } from '../../../../../../platform/instantiation/common/instantiation.js';

/**
 * Provides prompt services.
 */
export const IPromptsService = createDecorator<IPromptsService>('IPromptsService');

/**
 * Where the prompt is stored.
 */
export type TPromptsStorage = 'local' | 'user';

/**
 * What the prompt is used for.
 */
export type TPromptsType = 'instructions' | 'prompt';

/**
 * Represents a prompt path with its type.
 * This is used for both prompt files and prompt source folders.
 */
export interface IPromptPath {
	/**
	 * URI of the prompt.
	 */
	readonly uri: URI;

	/**
	 * Storage of the prompt.
	 */
	readonly storage: TPromptsStorage;

	/**
	 * Type
	 */
	readonly type: TPromptsType;
}

/**
 * Provides prompt services.
 */
export interface IPromptsService extends IDisposable {
	readonly _serviceBrand: undefined;

	/**
	 * Get a prompt syntax parser for the provided text model.
	 * See {@link TextModelPromptParser} for more info on the parser API.
	 */
	getSyntaxParserFor(
		model: ITextModel,
	): TextModelPromptParser & { disposed: false };

	/**
	 * List all available prompt files.
	 */
	listPromptFiles(type: TPromptsType): Promise<readonly IPromptPath[]>;

	/**
	 * Get a list of prompt source folders based on the provided prompt type.
	 */
	getSourceFolders(type: TPromptsType): readonly IPromptPath[];

	/**
	 * Returns a prompt command if the command name.
	 * Undefined is returned if the name does not look like a file name of a prompt file.
	 */
	asPromptSlashCommand(name: string): IChatPromptSlashCommand | undefined;

	/**
	 * Gets the prompt file for a slash command.
	 */
	resolvePromptSlashCommand(data: IChatPromptSlashCommand): Promise<IPromptPath | undefined>;

	/**
	 * Returns a prompt command if the command name is valid.
	 */
	findPromptSlashCommands(): Promise<IChatPromptSlashCommand[]>;

}

export interface IChatPromptSlashCommand {
	readonly command: string;
	readonly detail: string;
	readonly promptPath?: IPromptPath;
}
